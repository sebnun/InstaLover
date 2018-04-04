const { app, BrowserWindow, ipcMain, Menu, powerSaveBlocker } = require('electron')
const path = require('path')
const url = require('url')
const Instagram = require('instagram-web-api')
const cities = require('all-the-cities') //cities with pop > 1000
const isOnline = require('is-online');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 400,
        height: 400,
        //resizable: false, 
        maximizable: false,
        fullscreenable: false,
    })

    // and load the index.html of the app.
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, '/ui/build/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }))
    win.loadURL('http://localhost:3000');

    //15 min to make sure doesnt get blocked even when running all day
    //this is just to pass review, later improve

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q

    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let client
let powerBlockerId

ipcMain.on('login-message', async (event, args) => {
    let result

    const online = await isOnline()
    if (!online) {
        result = 'offline'
    } else {
        const username = args.user, password = args.password
        client = new Instagram({ username, password }, { language: app.getLocale() })

        let loginObj

        //checkpoint throws error
        try {
            loginObj = await client.login()
        } catch (e) {
            console.log(e.message)

            if (e.message.includes('checkpoint_required')) {
                //send challengeId for UI change to be handled in login
                const errorObj = JSON.parse(e.message.replace('400 - ', ''))

                //get info requied for ui
                const challenge = await client.getChallenge({ challengeUrl: errorObj.checkpoint_url })
                //phone or email can be empty? check in ui just in case
                event.sender.send('login-reply', { url: errorObj.checkpoint_url, email: challenge.fields.email, phone: challenge.fields.phone_number })
                return
            } else {
                event.sender.send('login-reply', 'error')
                return
            }
        }

        console.log(loginObj)
        if (!loginObj.authenticated) {
            result = 'error'
        } else {
            result = 'ok'
        }
    }

    event.sender.send('login-reply', result)
})

ipcMain.on('logout-message', async (event, args) => {
    //api has logout but it doesnt seem to work
    client = null
})

ipcMain.on('updateChallengeCode-message', async (event, args) => {
    //replies false on error, true ok
    let loginObj

    try {
        await client.updateChallenge(args) //this throws 400 error if code is wrong
        loginObj = await client.login()
    } catch (e) {
        console.log(e.message)
        event.sender.send('updateChallengeCode-reply', false)
        return
    }

    if (!loginObj.authenticated) {
        event.sender.send('updateChallengeCode-reply', false)
    } else {
        event.sender.send('updateChallengeCode-reply', true)
    }
})

ipcMain.on('updateChallenge-message', async (event, args) => {
    await client.updateChallenge(args)
})

ipcMain.on('resetChallenge-message', async (event, args) => {
    await client.resetChallenge(args)
})

ipcMain.on('replayChallenge-message', async (event, args) => {
    await client.replayChallenge(args)
})

ipcMain.on('startPowerBlocker-message', async (event, args) => {
    //monitor turns off, app doesnt
    powerBlockerId = powerSaveBlocker.start('prevent-app-suspension')
})

ipcMain.on('stopPowerBlocker-message', async (event, args) => {
    powerSaveBlocker.stop(powerBlockerId)
})

ipcMain.on('run-message', async (event, args) => {
    // const online = await isOnline()
    // if (!online) return //just fail silently KISS
    console.log('running')

    const smallCities = cities.filter(city => {
        return city.country !== 'CN' && city.population < 50000
    })

    const randomCity = smallCities[Math.floor(Math.random() * smallCities.length)];
    let cityName = ''
    if (randomCity.country === 'US') {
        cityName = randomCity.name + ', ' + abbrState(randomCity.adminCode, 'name')
    } else {
        cityName = randomCity.name + ', ' + getCountry(randomCity.country)
    }

    //get location id for city
    const locations = await client.search({ query: cityName, context: 'place' })
    await sleep(2000)

    if (locations.places.length === 0 || locations.places[0].place.location.pk === '0') {
        console.log('no locations for ' + cityName)
        event.sender.send('run-reply', { message: 'no locations' })
        return
    }

    //get feed for location id
    let feed = await client.getMediaFeedByLocation({ locationId: locations.places[0].place.location.pk })
    await sleep(2000)

    //console.log(feed)
    const posts = feed.edge_location_to_media.edges

    //filter feed of high liked posts
    const filteredPosts = posts.filter((post) => post.node.edge_liked_by.count < 10)

    let likeCount = 0
    //like posts from feed
    for (let i = 0; i < filteredPosts.length; i++) {
        try {
            await client.like({ mediaId: filteredPosts[i].node.id })
        } catch (error) {
            console.error(error.message, Date.now())
            if (error.message.includes('blocked')) {
                event.sender.send('run-reply', { message: 'blocked', date: + new Date(), likeCount })
                return
            }
            //other type of error can continuer it seems, so just ignore
            console.log(filteredPosts[i])
            continue
        }

        likeCount += 1

        console.log(`${likeCount} Liked https://www.instagram.com/p/${filteredPosts[i].node.shortcode}/ in ${cityName}`)
        //to simulate human behaviour after api calls
        await sleep(3000)
    }

    event.sender.send('run-reply', { message: 'ok', likeCount })
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function abbrState(input, to) {

    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr') {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < states.length; i++) {
            if (states[i][0] == input) {
                return (states[i][1]);
            }
        }
    } else if (to == 'name') {
        input = input.toUpperCase();
        for (i = 0; i < states.length; i++) {
            if (states[i][1] == input) {
                return (states[i][0]);
            }
        }
    }
}

function getCountry(code) {
    const countries = {
        "AD": "Andorra",
        "AE": "United Arab Emirates",
        "AF": "Afghanistan",
        "AG": "Antigua and Barbuda",
        "AI": "Anguilla",
        "AL": "Albania",
        "AM": "Armenia",
        "AN": "Netherlands Antilles",
        "AO": "Angola",
        "AQ": "Antarctica",
        "AR": "Argentina",
        "AS": "American Samoa",
        "AT": "Austria",
        "AU": "Australia",
        "AW": "Aruba",
        "AZ": "Azerbaijan",
        "BA": "Bosnia and Herzegovina",
        "BB": "Barbados",
        "BD": "Bangladesh",
        "BE": "Belgium",
        "BF": "Burkina Faso",
        "BG": "Bulgaria",
        "BH": "Bahrain",
        "BI": "Burundi",
        "BJ": "Benin",
        "BM": "Bermuda",
        "BN": "Brunei Darussalam",
        "BO": "Bolivia",
        "BR": "Brazil",
        "BS": "Bahamas",
        "BT": "Bhutan",
        "BV": "Bouvet Island",
        "BW": "Botswana",
        "BY": "Belarus",
        "BZ": "Belize",
        "CA": "Canada",
        "CC": "Cocos (Keeling) Islands",
        "CD": "Congo, the Democratic Republic of the",
        "CF": "Central African Republic",
        "CG": "Congo",
        "CH": "Switzerland",
        "CI": "Cote D\'Ivoire",
        "CK": "Cook Islands",
        "CL": "Chile",
        "CM": "Cameroon",
        "CN": "China",
        "CO": "Colombia",
        "CR": "Costa Rica",
        "CS": "Serbia and Montenegro",
        "CU": "Cuba",
        "CV": "Cape Verde",
        "CX": "Christmas Island",
        "CY": "Cyprus",
        "CZ": "Czech Republic",
        "DE": "Germany",
        "DJ": "Djibouti",
        "DK": "Denmark",
        "DM": "Dominica",
        "DO": "Dominican Republic",
        "DZ": "Algeria",
        "EC": "Ecuador",
        "EE": "Estonia",
        "EG": "Egypt",
        "EH": "Western Sahara",
        "ER": "Eritrea",
        "ES": "Spain",
        "ET": "Ethiopia",
        "FI": "Finland",
        "FJ": "Fiji",
        "FK": "Falkland Islands (Malvinas)",
        "FM": "Micronesia, Federated States of",
        "FO": "Faroe Islands",
        "FR": "France",
        "GA": "Gabon",
        "GB": "United Kingdom",
        "GD": "Grenada",
        "GE": "Georgia",
        "GF": "French Guiana",
        "GH": "Ghana",
        "GI": "Gibraltar",
        "GL": "Greenland",
        "GM": "Gambia",
        "GN": "Guinea",
        "GP": "Guadeloupe",
        "GQ": "Equatorial Guinea",
        "GR": "Greece",
        "GS": "South Georgia and the South Sandwich Islands",
        "GT": "Guatemala",
        "GU": "Guam",
        "GW": "Guinea-Bissau",
        "GY": "Guyana",
        "HK": "Hong Kong",
        "HM": "Heard Island and Mcdonald Islands",
        "HN": "Honduras",
        "HR": "Croatia",
        "HT": "Haiti",
        "HU": "Hungary",
        "ID": "Indonesia",
        "IE": "Ireland",
        "IL": "Israel",
        "IN": "India",
        "IO": "British Indian Ocean Territory",
        "IQ": "Iraq",
        "IR": "Iran, Islamic Republic of",
        "IS": "Iceland",
        "IT": "Italy",
        "JM": "Jamaica",
        "JO": "Jordan",
        "JP": "Japan",
        "KE": "Kenya",
        "KG": "Kyrgyzstan",
        "KH": "Cambodia",
        "KI": "Kiribati",
        "KM": "Comoros",
        "KN": "Saint Kitts and Nevis",
        "KP": "Korea, Democratic People\'s Republic of",
        "KR": "Korea, Republic of",
        "KW": "Kuwait",
        "KY": "Cayman Islands",
        "KZ": "Kazakhstan",
        "LA": "Lao People\'s Democratic Republic",
        "LB": "Lebanon",
        "LC": "Saint Lucia",
        "LI": "Liechtenstein",
        "LK": "Sri Lanka",
        "LR": "Liberia",
        "LS": "Lesotho",
        "LT": "Lithuania",
        "LU": "Luxembourg",
        "LV": "Latvia",
        "LY": "Libyan Arab Jamahiriya",
        "MA": "Morocco",
        "MC": "Monaco",
        "MD": "Moldova, Republic of",
        "MG": "Madagascar",
        "MH": "Marshall Islands",
        "MK": "Macedonia, the Former Yugoslav Republic of",
        "ML": "Mali",
        "MM": "Myanmar",
        "MN": "Mongolia",
        "MO": "Macao",
        "MP": "Northern Mariana Islands",
        "MQ": "Martinique",
        "MR": "Mauritania",
        "MS": "Montserrat",
        "MT": "Malta",
        "MU": "Mauritius",
        "MV": "Maldives",
        "MW": "Malawi",
        "MX": "Mexico",
        "MY": "Malaysia",
        "MZ": "Mozambique",
        "NA": "Namibia",
        "NC": "New Caledonia",
        "NE": "Niger",
        "NF": "Norfolk Island",
        "NG": "Nigeria",
        "NI": "Nicaragua",
        "NL": "Netherlands",
        "NO": "Norway",
        "NP": "Nepal",
        "NR": "Nauru",
        "NU": "Niue",
        "NZ": "New Zealand",
        "OM": "Oman",
        "PA": "Panama",
        "PE": "Peru",
        "PF": "French Polynesia",
        "PG": "Papua New Guinea",
        "PH": "Philippines",
        "PK": "Pakistan",
        "PL": "Poland",
        "PM": "Saint Pierre and Miquelon",
        "PN": "Pitcairn",
        "PR": "Puerto Rico",
        "PS": "Palestinian Territory, Occupied",
        "PT": "Portugal",
        "PW": "Palau",
        "PY": "Paraguay",
        "QA": "Qatar",
        "RE": "Reunion",
        "RO": "Romania",
        "RU": "Russian Federation",
        "RW": "Rwanda",
        "SA": "Saudi Arabia",
        "SB": "Solomon Islands",
        "SC": "Seychelles",
        "SD": "Sudan",
        "SE": "Sweden",
        "SG": "Singapore",
        "SH": "Saint Helena",
        "SI": "Slovenia",
        "SJ": "Svalbard and Jan Mayen",
        "SK": "Slovakia",
        "SL": "Sierra Leone",
        "SM": "San Marino",
        "SN": "Senegal",
        "SO": "Somalia",
        "SR": "Suriname",
        "ST": "Sao Tome and Principe",
        "SV": "El Salvador",
        "SY": "Syrian Arab Republic",
        "SZ": "Swaziland",
        "TC": "Turks and Caicos Islands",
        "TD": "Chad",
        "TF": "French Southern Territories",
        "TG": "Togo",
        "TH": "Thailand",
        "TJ": "Tajikistan",
        "TK": "Tokelau",
        "TL": "Timor-Leste",
        "TM": "Turkmenistan",
        "TN": "Tunisia",
        "TO": "Tonga",
        "TR": "Turkey",
        "TT": "Trinidad and Tobago",
        "TV": "Tuvalu",
        "TW": "Taiwan, Province of China",
        "TZ": "Tanzania, United Republic of",
        "UA": "Ukraine",
        "UG": "Uganda",
        "UM": "United States Minor Outlying Islands",
        "US": "United States",
        "UY": "Uruguay",
        "UZ": "Uzbekistan",
        "VA": "Holy See (Vatican City State)",
        "VC": "Saint Vincent and the Grenadines",
        "VE": "Venezuela",
        "VG": "Virgin Islands, British",
        "VI": "Virgin Islands, U.s.",
        "VN": "Viet Nam",
        "VU": "Vanuatu",
        "WF": "Wallis and Futuna",
        "WS": "Samoa",
        "YE": "Yemen",
        "YT": "Mayotte",
        "ZA": "South Africa",
        "ZM": "Zambia",
        "ZW": "Zimbabwe"
    };

    if (countries.hasOwnProperty(code))
        return countries[code]

    return code
}

const template = [{
    label: app.getName(),
    submenu: [
        { role: 'quit' }
    ]
}]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)