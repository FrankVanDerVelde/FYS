// Use this to get an array of dutch profanity words from the wiki
// https://nl.wiktionary.org/wiki/Categorie:Scheldwoord_in_het_Nederlands

const profanityList = [
    "aapmens",
    "aarstulp",
    "achterlader",
    "adder",
    "addergebroed",
    "afrotten",
    "apenjong",
    "apenkont",
    "appelflap",
    "autist",
    "babok",
    "badgast",
    "baggerduiker",
    "bangerd",
    "barslet",
    "bedrijfspoedel",
    "beheime",
    "belhamel",
    "bengel",
    "bermslet",
    "bitch",
    "bleekscheet",
    "bloedlijer",
    "boeler",
    "boer",
    "boerenheikneuter",
    "boerenhufter",
    "boerenkaffer",
    "boerenkarhengst",
    "boerenkinkel",
    "boerenpummel",
    "boerin",
    "bokkenrijder",
    "bosneuker",
    "botterik",
    "bouwdoos",
    "breezerslet",
    "brilsmurf",
    "broodaap",
    "bruinwerker",
    "bulderbast",
    "charlatan",
    "choco",
    "chocoladehoer",
    "chocoladesnol",
    "cijferneuker",
    "coronalijer",
    "covidioot",
    "cretin",
    "del",
    "deuggleuf",
    "dirkdoos",
    "doos",
    "dreuzel",
    "droplul",
    "druiloor",
    "dwaas",
    "ectoplasma",
    "eendenkont",
    "eikel",
    "etter",
    "etterbuil",
    "ezel",
    "fielt",
    "flapdrol",
    "fleer",
    "flessentrekker",
    "flikker",
    "foefkop",
    "galgenbrok",
    "gangster",
    "gannef",
    "geit",
    "geitenbreier",
    "geitenneuker",
    "geteisem",
    "gluiper",
    "gluiperd",
    "gluipsnor",
    "gratenbaal",
    "greppeldel",
    "grobbejanus",
    "haai",
    "halvezool",
    "hapsnurker",
    "harpij",
    "heaumeau",
    "heihaas",
    "heikneuter",
    "heks",
    "hersenlijer",
    "hockeytrut",
    "hockeytut",
    "hoerenjager",
    "hoerenjong",
    "hoerenkind",
    "hoerenzoon",
    "homo",
    "hondenlul",
    "hondenneuker",
    "hufter",
    "huppelkut",
    "huzarenhoop",
    "jeannette",
    "kaas",
    "kaashoer",
    "kaaskop",
    "kaffer",
    "kakhuis",
    "kakmadam",
    "kakmaker",
    "kamelenneuker",
    "kamerolifant",
    "kankerhoer",
    "kankerhond",
    "kankerlijder",
    "kankerlijer",
    "kankernicht",
    "kantoorpik",
    "kapsoneslijer",
    "karhengst",
    "karonje",
    "kees",
    "keilef",
    "kelerelijer",
    "keutelkut",
    "kinkel",
    "kip",
    "kippenneuker",
    "klafte",
    "klapkut",
    "klapluis",
    "klaplul",
    "klapperaap",
    "klere",
    "kloefkapper",
    "klojo",
    "klooi",
    "kloothannes",
    "kloothommel",
    "klootviool",
    "klootzak",
    "klote",
    "kluns",
    "knijpkont",
    "koeskoesvreter",
    "koffieboon",
    "kokosmakroon",
    "kontkruiper",
    "kontneuker",
    "kreng",
    "kriel",
    "krielkip",
    "krijslijster",
    "kruimelbuik",
    "kruiper",
    "kut",
    "kutstreek",
    "kuttenkop",
    "kutvent",
    "kutwijf",
    "kwakzalver",
    "labbekak",
    "labrat",
    "lafbek",
    "lamstraal",
    "lekkerpieper",
    "lelijkerd",
    "lijer",
    "linkmiegel",
    "lol",
    "lomperd",
    "lomperik",
    "loser",
    "luibak",
    "luibuis",
    "luiskop",
    "lul",
    "lulhannes",
    "lummel",
    "macaronivreter",
    "maffer",
    "mafketel",
    "mafkikker",
    "makaak",
    "masque",
    "matje",
    "mietje",
    "mispruim",
    "mispunt",
    "mof",
    "moffenhoer",
    "Moffrika",
    "mongool",
    "morsebel",
    "mosselhoer",
    "muilezelin",
    "muts",
    "natkut",
    "neetoor",
    "netenvreter",
    "neukpaal",
    "nitwit",
    "noppeshoer",
    "nul",
    "oen",
    "olijfneuker",
    "onderkruipsel",
    "optyfen",
    "ossenkop",
    "ossenlul",
    "ouwehoedendoos",
    "pagadder",
    "palurk",
    "paplap",
    "pasjakroet",
    "patjakker",
    "pedo",
    "pekelhoer",
    "pepermuntvreter",
    "pestlijder",
    "pigmentvreter",
    "pinda",
    "pindachinees",
    "pindapoepchinees",
    "pleurislijder",
    "ploert",
    "plucheplakker",
    "plurk",
    "pokkenlijder",
    "pokkenwijf",
    "polak",
    "politiemuts",
    "pommel",
    "populist",
    "pothoer",
    "puistenkop",
    "pukkelbek",
    "pummel",
    "raas",
    "randdebiel",
    "reetkever",
    "reetveger",
    "rekel",
    "roetmop",
    "rotmof",
    "rotzak",
    "rugridder",
    "ruigpoot",
    "sakkers",
    "sambalburger",
    "sambalvreter",
    "schaapskop",
    "schapenneuker",
    "schelm",
    "schijterd",
    "schijthoofd",
    "schijtlaars",
    "schijtlijster",
    "schijtluis",
    "schimmelkut",
    "schobbejak",
    "schoft",
    "schurftkop",
    "schurk",
    "schuurmeid",
    "secreet",
    "sekreet",
    "slet",
    "slettenbak",
    "slijmerd",
    "sloerie",
    "smeerkanis",
    "smeerlap",
    "smeerpijp",
    "smiecht",
    "smous",
    "snoever",
    "snotaap",
    "snotolf",
    "sodeflikker",
    "sodemieter",
    "sodomiet",
    "soepkip",
    "spaghettivreter",
    "spast",
    "spleetoog",
    "steenezel",
    "stinkbok",
    "stinker",
    "stinkerd",
    "stoephoer",
    "stomkop",
    "strontzak",
    "taalnazi",
    "taart",
    "teef",
    "teringlijder",
    "teringlijer",
    "tietvlieg",
    "totebel",
    "troelala",
    "trut",
    "tyfuslijder",
    "letiétéhoer",
    "letken",
    "vetklep",
    "vetzak",
    "viruswappie",
    "vlooienzak",
    "vuilak",
    "vullis",
    "wipkip",
    "zaagselkop",
    "zakkenvuller",
    "zakkenwasser",
    "zalfpot",
    "zeikbeer",
    "zeikerd",
    "zeikhannes",
    "zeiklijster",
    "zeiksnor",
    "zeikstraal",
    "zenuwenlijer",
    "zenuwlijer",
    "zeur",
    "zeurkous",
    "zeurpiet",
    "zeurzak",
    "zwartjoekel",
    "zwijn",
    "zwijnjak",
    "hoer",
    "kanker",
    "dikke",
    "tumor",
    "aids",
    "pest",
    "china is slecht",
    "cancer",
    "kys",
]

// Use this function when you want to censor profanity
export function censorProfanity (message) {
    let newMessage = message.toLowerCase();
    profanityList.forEach(profanityWord => {
        if (newMessage.includes(profanityWord)) {
            const replacementString = '*'.repeat(profanityWord.length) // Not supported by internet explorer
            // let str = new Array(len + 1).join( character ); // Full support
            newMessage = newMessage.split(profanityWord).join(replacementString);
        }
    });
    return newMessage;
}

