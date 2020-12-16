export type Viz = "map" | "themes" | "timeline" | "photographers";
export type MapView = "cities" | "counties";
export type CityKey = "DC_Washington" | "NY_NewYork" | "IL_Chicago" | "MI_Detroit" | "MD_Baltimore" | "TX_SanAugustine" | "PA_Pittsburgh" | "NM_PieTown" | "MN_Minneapolis" | "TX_SanAngelo" | "VT_Woodstock" | "MA_Provincetown" | "FL_BelleGlade" | "CA_Inglewood" | "TX_SanAntonio" | "GA_Greensboro" | "LA_Crowley" | "TN_Memphis" | "NJ_Hightstown" | "NC_Durham" | "OK_OklahomaCity" | "NJ_Bridgeton" | "NY_Buffalo" | "TN_Nashville" | "KY_Jackson" | "NM_Penasco" | "PR_SanJuan" | "OH_Akron" | "TX_CorpusChristi" | "IA_Ames" | "VA_FortBelvoir" | "FL_DaytonaBeach" | "AR_ForrestCity" | "OH_Cincinnati" | "LA_NewOrleans" | "ID_Caldwell" | "PA_Lititz" | "MT_Butte" | "NE_Omaha" | "IA_Dubuque" | "PA_Philadelphia" | "CA_SanDiego" | "CT_Southington" | "SC_ParrisIsland" | "VA_NewportNews" | "NY_Oswego" | "CA_ShastaDam" | "AL_Sheffield" | "ME_BarHarbor" | "VI_CharlotteAmalie" | "NH_Manchester" | "TX_Weslaco" | "OK_Muskogee" | "KS_FortRiley" | "KY_Louisville" | "MT_QuarterCircleURanch" | "WI_Greendale" | "AL_Childersburg" | "CA_SanFrancisco" | "OR_Vale" | "ME_FortKent" | "WA_Seattle" | "SC_Greenville" | "OR_MalheurNationalForest" | "MS_Clarksdale" | "CA_Woodville" | "AL_GeesBend" | "TX_Houston" | "GA_FortBenning" | "CA_Salinas" | "VI_Christiansted" | "PA_Erie" | "WI_Madison" | "MO_SaintLouis" | "AR_LakeDick" | "WV_Reedsville" | "TX_Alpine" | "AZ_ElevenMileCorner" | "CO_Denver" | "TX_Borger" | "AZ_Phoenix" | "GA_DanielField" | "LA_Donaldsonville" | "IL_Herrin" | "TN_FortLoudounDam" | "NC_Belcross" | "NM_Mogollon" | "OH_Chillicothe" | "LA_Melrose" | "OR_Astoria" | "MT_GreatFalls" | "VA_Radford" | "NC_FortBragg" | "GA_WarnerRobins" | "FL_Homestead" | "GA_Atlanta" | "PR_Guanica" | "MS_Mileston" | "CA_SanBernardino" | "FL_Sarasota" | "WV_Richwood" | "TX_Beaumont" | "TN_DouglasDam" | "MS_Laurel" | "WV_RedHouse" | "ND_Williston" | "CA_Shafter" | "TX_CrystalCity" | "OH_Toledo" | "CA_Calipatria" | "TX_FortWorth" | "MO_Sikeston" | "MN_EastGrandForks" | "KS_KansasCity" | "NM_Albuquerque" | "VA_Keysville" | "TX_Waco" | "AZ_Concho" | "WI_BlackRiverFalls" | "OH_Columbus" | "VT_Albany" | "MN_Effie" | "IN_FortHarrison" | "TX_ElPaso" | "CO_Silverton" | "LA_Alexandria" | "OH_Gallipolis" | "MI_Interlochen" | "MS_Natchez" | "MN_LittleFork" | "MN_Winton" | "MT_Hamilton" | "WA_Yakima" | "OR_Hermiston" | "VA_Charlottesville" | "CA_Turlock" | "RI_Providence" | "MN_Duluth" | "PA_MauchChunk" | "IA_GrundyCenter" | "WV_Omar" | "FL_EscambiaFarms" | "ID_Rupert" | "TX_Gonzales" | "NV_LasVegas" | "AZ_Yuma" | "NM_PinosAltos" | "IN_Wabash" | "MT_MilesCity" | "CA_ImperialValley" | "MO_Caruthersville" | "MT_Billings" | "TX_Dallas" | "KY_Lexington" | "CA_EdwardsAirForceBase" | "GA_Franklin" | "MA_Hatfield" | "AZ_AguaFria" | "MN_Northome" | "VA_Roanoke" | "AL_Montgomery" | "AZ_Morenci" | "TX_HoskinsMound" | "VT_EssexJunction" | "ME_PresqueIsle" | "GA_Irwinville" | "TN_Chattanooga" | "NE_Scottsbluff" | "TX_Brownwood" | "UT_BinghamCanyon" | "KS_Topeka" | "TX_Ralls" | "DE_Wilmington" | "IL_Aledo" | "UT_SantaClara" | "NY_Rochester" | "OR_Merrill" | "MO_OsageFarms" | "PA_DuBois" | "FL_Lakeland" | "TX_Amarillo" | "LA_Morganza" | "TX_ElIndio" | "KY_Barbourville" | "IL_Shawneetown" | "OH_Mechanicsburg" | "MI_BentonHarbor" | "IA_Dickens" | "NC_Charlotte" | "VA_LittleCreek" | "FL_KeyWest" | "SC_Manning" | "NH_Berlin" | "WI_Superior" | "AL_Enterprise" | "LA_Olga" | "TN_Crossville" | "IN_Fowler" | "ME_Bath" | "AZ_Tombstone" | "CO_Creede" | "GA_Hinesville" | "LA_Thomastown" | "WI_Allouez" | "NM_WagonMound" | "FL_Jacksonville" | "CA_Tulelake" | "WV_Dailey" | "OR_Tillamook" | "CA_NewIdria" | "TX_Jefferson" | "OR_WillametteNationalForest" | "NC_Asheville" | "TX_Spur" | "IN_Vincennes" | "NM_Costilla" | "MS_Vicksburg" | "AR_Lakeview" | "CO_Leadville" | "NM_Clovis" | "CA_YubaCity" | "TX_Taylor" | "IA_Woodbine" | "SC_Bowman" | "MT_GravellyRange" | "MT_CrowAgency" | "MS_PortGibson" | "NY_LittleFalls" | "AL_Greensboro" | "MN_Austin" | "WV_Racine" | "KY_Owensboro" | "OH_Sandusky" | "KS_Wichita" | "PA_PineGroveMills" | "VA_Danville" | "OR_Odell" | "VT_SheldonSprings" | "WY_Laramie" | "WV_Mohegan" | "FL_Starke" | "UT_Mendon" | "IA_Burlington" | "CO_MonteVista" | "MT_Froid" | "HI_PearlHarbor" | "DE_Dover" | "IA_Clinton" | "KS_Syracuse" | "NV_Goldfield" | "AZ_Kingman" | "CT_Stamford" | "CO_Montrose" | "AL_Mobile" | "MT_Missoula" | "OR_Portland" | "AR_LittleRock" | "IN_WabashFarms" | "TX_CollegeStation" | "OK_Cardin" | "CA_Stockton" | "SD_TwoBitCreek" | "NH_Franconia" | "OR_RogueRiverNationalForest" | "TX_Junction" | "MT_Wyola" | "NY_PineCamp" | "IA_FortMadison" | "KS_Cimarron" | "MS_Tupelo" | "NE_Lexington" | "WI_Antigo" | "NH_NorthConway" | "OR_BonnevilleDam" | "VA_Harrisonburg" | "ME_MooselookmegunticLake" | "SD_Aberdeen" | "OH_NewCarlisle" | "NC_Enfield" | "ID_Shelley" | "OR_GrantsPass" | "OR_WestStayton" | "MO_KansasCity" | "AL_Eutaw" | "NC_PenderleaHomesteads" | "MI_IronRiver" | "AZ_Bisbee" | "WI_Tipler" | "ND_Crosby" | "ME_Portland" | "WA_WallaWalla" | "IN_Gibson" | "SC_Bonneau" | "WV_Longacre" | "SC_MyrtleBeach" | "KY_Smithland" | "AL_Scottsboro" | "ID_SalmonRiverValley" | "MT_Kalispell" | "ND_Minot" | "AR_Batesville" | "MT_Plentywood" | "NY_Erin" | "MT_Havre" | "ME_BuffaloHill" | "WA_Longview" | "NV_DangbergRanch" | "TX_Comanche" | "IL_Cairo" | "AR_Centerville" | "NC_Maxton" | "LA_AmiteCity" | "MI_Muskegon" | "CA_Loomis" | "GA_StMarys" | "CO_FryingPanCreek" | "NV_Elko" | "WI_Westby" | "SC_Charleston" | "LA_Transylvania" | "MA_Fitchburg" | "HI_Kauai" | "ID_TwinFalls" | "CO_Ashcroft" | "UT_Consumers" | "AL_Moundville" | "TX_Dalhart" | "IN_Nashville" | "OR_Independence" | "SD_Sisseton" | "TN_Ducktown" | "SC_Summerville" | "LA_GrandEcaille" | "OK_Depew" | "IA_SiouxCity" | "TN_Huntingdon" | "NM_Vaughn" | "IA_Anthon" | "CA_Needles" | "TN_Tiptonville" | "IL_Salem" | "UT_Ironton" | "TN_PickwickDam" | "CA_Sacramento" | "WI_LaCrosse" | "ME_SoldierPond" | "VA_Luray" | "IA_CedarRapids" | "NE_NorthPlatte" | "NC_Statesville" | "KS_Moundridge" | "CA_CoachellaValley" | "MO_Chillicothe" | "WI_Manitowoc" | "IL_McLeansboro" | "ND_Bismarck" | "OH_Portsmouth" | "PA_Scranton" | "AZ_Winslow" | "NY_Ithaca" | "CO_Akron" | "UT_Escalante" | "IA_Ringgold" | "CO_Georgetown" | "NV_CarsonCity" | "CA_Nipomo" | "MT_SaintMaryLake" | "TX_Memphis" | "OR_Athena" | "TN_Lexington" | "WV_Romney" | "CO_Granby" | "OK_Spiro" | "MT_Terry" | "MI_Mansfield" | "ND_Fargo" | "MT_Fairfield" | "UT_Widtsoe" | "SC_Columbia" | "WI_SturgeonBay" | "MS_StateLine" | "KS_Wellington" | "CO_Ordway" | "CO_Montezuma" | "AZ_Safford" | "CA_Barstow" | "MS_Benoit" | "TX_Abilene" | "NC_Winston-Salem" | "MA_Billerica" | "WA_EurekaFlat" | "PA_Bradford" | "MT_Bannack" | "MT_Bozeman" | "KS_Oskaloosa" | "ND_Hettinger" | "MN_MahoningMine" | "MN_DanubeMine" | "NV_Ruth" | "UT_Snowville" | "MS_SunflowerPlantation" | "NY_Oneida" | "KS_Sublette" | "NM_Hobbs" | "AZ_BorianaMine" | "AL_PhenixCity" | "CA_SalinasValley" | "OK_Slick" | "CO_Kersey" | "LA_Fullerton" | "OR_WestCarlton" | "IN_Shadeland" | "MS_Jackson" | "MS_Scott" | "VA_Winchester" | "IN_Clinton" | "NM_LasCruces" | "MS_Biloxi" | "GA_Valdosta" | "FL_Pensacola" | "NV_ElDoradoCanyon" | "CA_GoldHill" | "GA_Pembroke" | "CA_Fresno" | "NY_Sterlingville" | "MN_Bemidji" | "AL_GuntersvilleDam" | "WY_Emblem" | "VA_Milford" | "NE_GrandIsland" | "NE_Kearney" | "KY_Russellville" | "ME_Rockland" | "ND_Starkweather" | "MN_Williams" | "DE_Bridgeville" | "AL_Tuskegee" | "WA_Tenino" | "NC_Gordonton" | "FL_SaintPetersburg" | "CA_Firebaugh" | "KY_HorseCave" | "MT_Helena" | "ND_GrandForks" | "NM_Gallup" | "AZ_Flagstaff" | "OR_Molalla" | "KS_Emporia" | "FL_TarponSprings" | "TX_BigSpring" | "FL_Baker" | "NV_Reno" | "NY_FortHunter" | "WA_Colfax" | "GA_Statesboro" | "NV_Rhyolite" | "TX_Hereford" | "WY_Sheridan" | "ND_Casselton" | "OH_Newark" | "ND_GrassyButte" | "NH_Hanover" | "KS_Kiowa" | "CA_SanJose" | "IA_Armstrong" | "AZ_Williams" | "AL_Gadsden" | "NE_Hastings" | "NC_Wadesboro" | "MN_BeltramiIsland" | "CO_Durango" | "IN_MountVernon" | "MO_Marceline" | "MO_JeffersonCity" | "GA_Douglas" | "OH_Somerset" | "IN_BattleGround" | "AR_Jerome" | "MS_Greenville" | "AL_Troy" | "FL_DadeCity" | "NC_HiwasseeDam" | "AL_Falco" | "KS_Chanute" | "AK_Nome" | "NY_Cortland" | "ND_Gladstone" | "CO_FortGarland" | "MD_Jennings" | "MO_Salem" | "IN_Clayton" | "MN_Cook" | "ID_OroFino" | "MT_Ravalli" | "ID_Genesee" | "CO_Craig" | "MN_Gheen" | "ID_BonnersFerry" | "TX_Stratford" | "ME_Livermore" | "CT_Canterbury" | "MN_BrownsValley" | "IA_Denison" | "OR_Gilchrist" | "KS_Liberal" | "MT_Mouat" | "CO_CampCarson" | "AL_Bankhead" | "MI_TroutCreek" | "SD_PineRidge" | "KS_Columbus" | "MI_BruceCrossing" | "MT_Glendive" | "NM_Lordsburg" | "ND_Dickinson" | "TX_Odessa" | "MI_FranklinMine" | "OR_Madras" | "MS_Sunflower" | "WY_Buford" | "VA_Lynchburg" | "NE_York" | "MT_Forsyth" | "OK_Forgan" | "CO_Hotchkiss" | "TX_Dumas" | "ID_Cascade" | "NY_Watertown" | "GA_Hazlehurst" | "TN_Camden" | "ME_Fryeburg" | "KS_Centralia" | "NV_Austin" | "NC_Wilmington" | "CA_Tracy" | "IN_Rockville" | "OR_CowHollow" | "OH_Marion" | "NM_Thoreau" | "WA_Goldendale" | "SD_Pierre" | "OK_ElmGrove" | "WA_Malone" | "WA_Touchet" | "OK_McAlester" | "MT_WolfPoint" | "AR_Eudora" | "CA_Manzanar" | "GA_Bethany" | "ND_Medora" | "ND_SouthHeart" | "NM_Encino" | "UT_Cornish" | "CO_Springfield" | "NV_SilverPeak" | "ND_Beach" | "CO_Gilcrest" | "FL_Orlando" | "AZ_Topock" | "ND_Belfield" | "NM_FortSumner" | "KS_YatesCenter" | "NM_Roswell" | "VA_Onley" | "NY_WatkinsGlen" | "MS_Terry" | "VA_SouthBoston" | "ND_Hillsboro" | "TX_Ropesville" | "MO_Neosho" | "MA_Worcester" | "KY_Covington" | "SD_Mission" | "CO_SawatchRange" | "GA_Savannah" | "WV_Parkersburg" | "ND_SaintAnthony" | "NM_CapulinVolcanoNationalMonument" | "AL_Anniston" | "NE_PineRidge" | "NE_Alliance" | "DE_Lewes" | "IL_MountCarmel" | "VA_Rustburg" | "IN_PointTownship" | "MS_Oxford" | "MS_Pearlington" | "NH_MountWhittier" | "ND_Doyon" | "ND_Rolla" | "AZ_TheodoreRooseveltDam" | "AZ_Gleed" | "OH_Mansfield" | "NM_Mountainair" | "NC_Boone" | "OK_Waynoka" | "SC_Gaffney" | "MO_Nevada" | "OH_Marietta" | "TX_WichitaGardens" | "WY_FortBridger" | "MO_Baring" | "SD_TimberLake" | "IL_EastDubuque" | "ID_Preston" | "MT_Brockway" | "NY_Utica" | "VA_Dennison" | "GA_Alma" | "CT_Mystic" | "CA_Yreka" | "KS_Minneapolis" | "DE_StrawberryPoint" | "AR_Clarksville" | "DE_TrapPond" | "PA_Chaneysville" | "NY_Belfast" | "IN_Blankenship" | "TN_CoveLakeStatePark" | "NV_Tonopah" | "UT_Tropic" | "CO_SanLuis" | "WA_Cathlamet" | "IA_Marengo" | "IA_Davenport" | "WI_Boscobel" | "ND_Carson" | "WA_Bickleton" | "CA_SanMiguelMission" | "AZ_Salome" | "ND_LoneTree" | "MI_Laurium" | "ID_CratersoftheMoonNationalMonument" | "VA_Staunton" | "IL_Robinson" | "LA_Delhi" | "TX_Burton" | "CA_Lompoc" | "NH_CenterSandwich" | "PA_Canton" | "UT_Heber" | "KS_Augusta" | "FL_Tampa" | "AR_Fayetteville" | "NC_Hoffman" | "IN_Hammond" | "AZ_AshFork" | "GA_Habersham" | "PA_Gettysburg" | "MN_Rice" | "NM_Willard" | "OK_Atoka" | "TX_Dawn" | "IA_Mapleton" | "TX_Midland" | "TX_Carey" | "CO_Garcia" | "SD_Bowdle" | "ND_Wildrose" | "MT_Glasgow" | "TX_Miami" | "KS_Harper" | "WA_Vader" | "OH_Athens" | "OK_OilCity" | "MO_Sibley" | "OK_Alva" | "TX_Codman" | "OK_Capron" | "WI_Plymouth" | "GA_Homerville" | "AR_Huntsville" | "NM_Melrose" | "SD_TrailCity" | "SD_Mobridge" | "MO_Carrollton" | "ND_Richardton" | "ND_NewSalem" | "ND_Reeder" | "MT_Jordan" | "MT_JudithGap" | "ID_PantherCreek" | "NV_ValleyofFire" | "CO_UncompahgreRiver" | "GA_Cairo" | "FL_Monticello" | "AZ_Seligman" | "MI_Baraga" | "CA_Ludlow" | "KS_Hoxie" | "WI_Springbrook" | "TX_Gatesville" | "ME_Houlton" | "MT_CrowIndianReservation" | "MI_SilkLake" | "OK_Guymon" | "WI_NewLisbon" | "NM_LlanoLargo" | "OK_Sapulpa" | "AL_Greenville" | "IL_Maunie" | "LA_Franklin" | "VA_Tappahannock" | "KY_Harrodsburg" | "KS_FlintHills" | "KY_Linwood" | "PA_Wilkes-Barre" | "OK_BoiseCity" | "OR_CraterLakeNationalPark" | "ID_Sandpoint" | "AR_Zinc" | "SD_Keystone" | "NC_Washington" | "AR_Blytheville" | "KS_GardenCity" | "OR_Mapleton" | "ID_Stanley" | "PA_UnionTownship" | "PA_Williamsport" | "ND_Alkabo" | "WA_Newport" | "KS_Erie" | "ND_Grenora" | "MA_SavoyMountainStateForest" | "WY_BigPiney" | "AR_Piggott" | "WY_Farson" | "IA_IowaCity" | "OK_Hydro" | "SD_Miller" | "FL_LowerMatecumbeKey" | "NC_Kinston" | "TX_Quemado" | "TX_Crane" | "PA_Lewistown" | "MO_Troy" | "MS_CampShelby" | "ND_Velva" | "MN_Dawson" | "CA_Brentwood" | "PA_Waynesboro" | "NM_Hatch" | "CO_Keota" | "TN_Pikeville" | "AL_Tuscaloosa" | "SC_Hartsville" | "AZ_Yampai" | "OK_FortSill" | "MD_Oakland" | "OR_Bourne" | "GA_Byromville" | "KS_BaldwinCity" | "ID_Grangeville" | "ID_Craigmont" | "LA_OakGrove" | "WA_Dayton" | "CA_LosBanos" | "WY_MedicineBow" | "TX_Palacios" | "SD_RapidCity" | "AK_AttuIsland" | "VA_Washington" | "NE_LoupCity" | "TX_DeLeon" | "NM_Ricardo" | "OR_Celilo" | "NM_Tolar" | "TX_Farwell" | "TX_Friona" | "AL_IronCity" | "KY_KentuckyDam" | "MN_Gilbert" | "VA_Java" | "MN_LittleFalls" | "NM_Portales" | "CT_Voluntown" | "NV_Eureka" | "MA_NorthAdams" | "CA_Chico" | "TX_Texhoma" | "AR_Atkins" | "ID_Tamarack" | "WI_Bridgeport" | "ID_BigWoodRiver" | "NE_Beatrice" | "ND_Bowman" | "AR_Chicot" | "MS_RollingFork" | "AR_BaldKnob" | "NE_Chadron" | "OR_DiamondLake" | "TX_Stanton" | "TX_Lubbock" | "TX_Balmorhea" | "OK_Akins" | "NE_Gilead" | "SD_BelleFourche" | "MN_FergusFalls" | "MS_Picayune" | "TX_Corsicana" | "CO_LaJunta" | "SD_Murdo" | "TX_Canadian" | "SD_Martin" | "IA_MillerTownship" | "MN_Wadena" | "KS_Shaw" | "TX_GlenRose" | "IL_Grafton" | "KY_Ashland" | "AZ_Holbrook" | "IN_Brazil" | "TX_Cuero" | "SD_Rosebud" | "GA_Waycross" | "GA_Godwinsville" | "MO_Malden" | "AZ_BeckersButte" | "KY_CentralCity" | "AZ_ApacheNationalForest" | "TX_Sweetwater" | "TX_ColoradoCity" | "MS_Kiln" | "AZ_Miami" | "CO_FortCollins" | "SD_Draper" | "MI_Allegan" | "OK_Caddo" | "CA_Klondike" | "OR_WarmSprings" | "KS_McPherson" | "MT_Hysham" | "MI_Ironwood" | "MN_Graceville" | "IL_Springfield" | "CA_Bagdad" | "GA_Thomaston" | "ND_DevilsLake" | "SD_Groton" | "OK_Olustee" | "ND_Max" | "CO_Independence" | "SD_Webster" | "SD_WoundedKnee" | "WY_Ranchester" | "NC_RockyMount" | "GA_Manchester" | "KS_Salina" | "WI_Zachow" | "GA_Griffin" | "MD_Cumberland" | "NE_Whiteclay" | "WI_Cadott" | "KY_Guthrie" | "NC_FontanaDam" | "IL_Grayville" | "WI_RichlandCenter" | "NC_SmokyMountains" | "MS_Woodville" | "OR_Willamette" | "WV_Clay" | "SC_Monticello" | "FL_Frostproof" | "GA_Sylvania" | "PR_Camuy" | "IA_Onawa" | "SD_Lemmon" | "WI_Millville" | "NV_PineCreekCanyon" | "ND_Granville" | "SD_Zell" | "SD_Doland" | "SD_Orient" | "SD_Northville" | "ND_NewEngland" | "IN_Roanoke" | "LA_Houma" | "MT_Dewey" | "TX_Uvalde" | "MT_Lewiston" | "MA_WestNewbury" | "MT_LakeMcDonald" | "WY_Beulah" | "OK_Frederick" | "MA_Haverhill" | "CO_Kremmling" | "WY_Cheyenne" | "NE_Gothenburg" | "AL_Ashford" | "WA_Waitsburg" | "ID_Kamiah" | "ID_Lewiston" | "MO_Seligman" | "AK_Fairbanks" | "ND_Langdon" | "OH_Hopedale" | "WI_Waupun" | "MO_Peculiar" | "AL_Sprott" | "AL_Advance" | "WA_CouleeDam" | "VA_CampLee" | "TX_KellyField" | "ID_SalmonRiverMountains" | "ME_Passamaquoddy" | "ID_StanleyLake" | "CA_HotSprings" | "ID_Salmon" | "IN_FortWayne" | "PA_Mansfield" | "NE_FallsCity" | "MA_NorthBrookfield" | "CO_LasAnimas" | "OR_Siltcoos" | "WA_Ritzville" | "WY_Gillette" | "NY_Moravia" | "MT_Broadus" | "CO_Sapinero" | "GA_Rome" | "TN_Tullahoma" | "MO_Ashland" | "AZ_Douglas" | "AZ_Paradise" | "AZ_Willcox" | "NM_Leopold" | "TX_Denison" | "TX_PortO'Connor" | "TN_Greenville" | "GA_Gainesville" | "FL_LiveOak" | "AZ_Duncan" | "OK_Perry" | "CA_Winters" | "TX_Colorado" | "IA_Smithfield" | "TX_Austin" | "ND_Stanley" | "TX_Huntsville" | "ND_Towner" | "IN_BurnsCity" | "CA_Goffs" | "NV_FortMcDermittIndianReservation" | "AZ_Yucca" | "OH_EastLiverpool" | "AZ_PeachSprings" | "ID_SaintAnthony" | "OH_Huntington" | "TX_Parmerton" | "NM_Yeso" | "NE_Imperial" | "NV_EmigrantPass" | "WY_GreenRiver" | "TX_Finlay" | "NE_Agate" | "MO_Hughesville" | "CO_GrandJunction" | "TX_Roscoe" | "NM_Duoro" | "VA_Culpeper" | "CO_Eaton" | "TN_Elizabethton" | "TX_Ennis" | "MT_GallatinValley" | "OK_Woodward" | "OK_Belva" | "MT_MadisonRange" | "MT_ThreeForks" | "MS_Hazelhurst" | "KS_LeLoup" | "AL_Robertsdale" | "FL_Marianna" | "GA_DuPont" | "CA_DosPalos" | "AR_Conway" | "NM_PenascoValley" | "AR_Wilson" | "MT_Neihart" | "PA_McConnellsburg" | "AR_FortSmith" | "OR_Kirby" | "CA_Orick" | "OR_Arlington" | "NM_Dora" | "WA_CouleeCity" | "WA_Centralia" | "OR_MarysRiver" | "OR_CottageGrove" | "OR_SunsetValley" | "OR_Maupin" | "TX_PortIsabel" | "AR_Hope" | "AR_Gurdon" | "FL_SaintAugustine" | "CA_SanLuisObispo" | "CA_Tranquillity" | "UT_Springdale" | "FL_Brooksville" | "TX_Everett" | "AR_Menifee" | "FL_McKethanLake" | "OK_Hollis" | "OK_Gould" | "TX_Perryton" | "GA_Americus" | "ME_WellsBeach" | "ME_Gloucester" | "MS_BaySaintLouis" | "MS_PassChristian" | "PA_Riddlesburg" | "MO_Hart" | "MO_Henrietta" | "MO_Camden" | "AR_NortheastArkansas" | "VA_Lexington" | "MS_Foote" | "OK_Chickasaw" | "OK_Tangier" | "OK_Fargo" | "TX_Higgins" | "TX_Glazier" | "LA_Shreveport" | "TX_Hoover" | "TX_VanHorn" | "CO_GardenPark" | "TX_Navarro" | "TX_Anton" | "CO_Antonio" | "MO_Columbia" | "NV_Wells" | "AZ_Tucson" | "CA_Coachella" | "UT_Wendover" | "AR_Harrison" | "NE_Heartwell" | "NV_Beowawe" | "KS_Elkhart" | "NM_Lucy" | "FL_Yulee" | "NV_Yucca" | "NM_Manuelito" | "AZ_Allentown" | "AZ_Houck" | "AZ_Supai" | "WV_Eatons" | "MA_GreatBarrington" | "NV_MoapaRiverIndianReservation" | "AZ_Nelson" | "NV_McGill" | "NV_Currie" | "MN_Biwabik" | "VA_Appomattox" | "CA_Bryman" | "CA_OroGrande" | "IL_Newton" | "AL_Evergreen" | "IN_Smithland" | "ND_Denbigh" | "ND_Larimore" | "TX_Bastrop" | "TX_Vernon" | "KS_Oakley" | "VA_Woodstock" | "TX_RioGrandeCity" | "CA_Blythe" | "CA_Farmington" | "MS_Brookhaven" | "MS_Meridian" | "NE_Sutherland" | "VA_Roseland" | "NC_Wilson" | "KY_Mayfield" | "TX_Edna" | "FL_Fernandez" | "MO_Clearmont" | "AZ_Globe" | "GA_Stockton" | "GA_Clarksville" | "IA_Ottumwa" | "AZ_PintoCreek" | "MO_PoplarBluff" | "MO_StoneHill" | "NC_Rosewood" | "WY_Lusk" | "ID_Kellogg" | "OR_DeschutesRiver" | "UT_Panguitch" | "OR_KoosahFalls" | "SD_Wall" | "NE_BrokenBow" | "TN_Manchester" | "UT_Henefer" | "WY_Jackson" | "WY_Dubois" | "SD_Ardmore" | "KS_WestMineral" | "KS_Richmond" | "KS_Galena" | "NM_Bosque" | "NM_ElephantButteDam" | "LA_Jena" | "ND_NewHradec" | "ND_Charlson" | "PA_Williamsburg" | "TX_Muleshoe" | "ID_Midway" | "KS_DodgeCity" | "NM_Clayton" | "KS_Hays" | "MS_Waveland" | "WI_Necedah" | "ID_Pocatello" | "AR_Winslow" | "OK_Enid" | "AK_Kiska" | "AK_Skagway" | "MS_NittaYuma" | "FL_ClearwaterBeach" | "OK_Moffett" | "ID_Blackfoot" | "OR_Ashland" | "SC_York" | "NH_Haverhill" | "PA_FoxHill" | "MS_McComb" | "NC_Wilmar" | "PA_Altoona" | "KS_Seneca" | "ND_Bottineau" | "NC_CampLejeune" | "MN_Moorhead" | "ME_Calais" | "ME_Robbinston" | "AL_GuntersvilleLake" | "KS_Brookville" | "TX_FortHood" | "IL_Silvis" | "SD_Selby" | "ME_Monticello" | "VA_HughesRiver" | "TX_Laredo" | "WA_Pomeroy" | "OR_Yoncalla" | "MA_Methuen" | "CO_Hayden" | "NM_Deming" | "WV_BerkeleySprings" | "MN_Morris" | "MN_Willmar" | "MN_Benson" | "TX_WalnutSprings" | "WA_Pullman" | "MT_BarBRanch" | "ND_Upham" | "MT_SandSprings" | "MT_Circle" | "TX_Mineola" | "FL_Cocoa" | "ND_DunnCenter" | "IL_Rising" | "SC_Cheraw" | "TN_Dayton" | "ND_Hazen" | "IN_PortTownship" | "SD_Roscoe" | "SD_Glenham" | "AR_Rogers" | "VA_Richmond" | "OR_Medford" | "OR_Monroe" | "VA_Covington" | "NH_Springfield" | "NV_Winnemucca" | "SD_Ipswich" | "SD_WhiteButte" | "NH_NorthWalpole" | "KS_Almena" | "NY_Copenhagen" | "NY_LyonMountain" | "WV_Buckhannon" | "WV_Bluefield" | "FL_Sebring" | "MI_Sidnaw" | "WI_Menomonie" | "GA_Dover" | "OR_FortKlamath" | "TN_Monteagle" | "MT_Wibaux" | "WI_Siren" | "NC_Greenville" | "MN_Kellogg" | "OH_Findlay" | "IL_Hammond" | "PA_Mercersburg" | "NM_Carlsbad" | "WI_Fennimore" | "NE_Dalton" | "WY_JayEm" | "SD_Batesland" | "WV_Harper'sFerry" | "IL_Galesburg" | "IA_AlbertCity" | "NE_Wymore" | "KS_Toronto" | "ND_WhiteEarth" | "KS_Concordia" | "GA_Cordele" | "MT_Loma" | "NC_Goldsboro" | "WY_JacksonHole" | "CO_SteamboatSprings" | "SD_Roslyn" | "TX_CampHood" | "MA_Pittsfield";
export type NHGISJoinCode = "G0250115" | "G4804270" | "G1100010" | "G0101030" | "G0100790" | "G2905100" | "G1900150" | "G0500710" | "G4803270" | "G0600610" | "G1900410" | "G0801210" | "G1200950" | "G1700430" | "G1700530" | "G1701230" | "G1801670" | "G2000510" | "G3600030" | "G2700710" | "G2200350" | "G2200890" | "G2300130" | "G2600050" | "G2700030" | "G2700250" | "G2902290" | "G3000870" | "G3701530" | "G4200770" | "G3100450" | "G3101850" | "G3300010" | "G3400370" | "G3600390" | "G3901510" | "G4100510" | "G4100550" | "G4802050" | "G4100710" | "G4500250" | "G4500390" | "G4800650" | "G4804390" | "G4800270" | "G5101090" | "G4800010" | "G4802650" | "G4804210" | "G4804230" | "G4804830" | "G5101250" | "G5101070" | "G5300010" | "G5500170" | "G5500790" | "G0100170" | "G0100710" | "G0600570" | "G0101010" | "G4801150" | "G0101310" | "G0501070" | "G0600250" | "G0800030" | "G0600430" | "G0600530" | "G0600650" | "G0600770" | "G0800110" | "G0800230" | "G0800250" | "G0800090" | "G0800470" | "G0801170" | "G0801190" | "G3700070" | "G0900030" | "G1201210" | "G1300290" | "G3900990" | "G2701510" | "G1302990" | "G4200190" | "G2100090" | "G1900730" | "G1900750" | "G1901270" | "G1600050" | "G1600270" | "G1600170" | "G1600670" | "G1700150" | "G1600810" | "G1700470" | "G1701110" | "G1701850" | "G1800010" | "G1800070" | "G1801690" | "G2000770" | "G2000870" | "G2001770" | "G2100130" | "G2101810" | "G2200510" | "G2200710" | "G2200750" | "G2200950" | "G2400450" | "G2601250" | "G2701190" | "G2902210" | "G3600570" | "G3000470" | "G3000450" | "G4200730" | "G3701390" | "G3701830" | "G3100010" | "G3101570" | "G3300030" | "G3500070" | "G3101650" | "G3600850" | "G3900290" | "G3600490" | "G3900450" | "G3900890" | "G3901130" | "G4000210" | "G4000370" | "G4200210" | "G4100350" | "G4100650" | "G2100170" | "G4200970" | "G4200990" | "G4500790" | "G4600490" | "G4800930" | "G4800490" | "G4801130" | "G4800470" | "G4701550" | "G4800050" | "G4802570" | "G4803030" | "G5101570" | "G5100090" | "G5100110" | "G5100550" | "G5300050" | "G5300390" | "G5501090" | "G5400530" | "G1302370" | "G1901130" | "G3900850" | "G4200690" | "G3600930" | "G4802430" | "G2800670" | "G1302770" | "G1901350" | "G2001570" | "G5100790" | "G1901470" | "G1700190" | "G0250015" | "G0250035" | "G1900210" | "G0100030" | "G1900130" | "G0250075" | "G0100350" | "G0100050" | "G0100130" | "G0500370" | "G0100150" | "G0100210" | "G2901770" | "G0100310" | "G0100330" | "G0100390" | "G0500070" | "G0100470" | "G0100510" | "G1302110" | "G0100550" | "G0100630" | "G0100650" | "G0100690" | "G0100810" | "G0100770" | "G0100870" | "G2900090" | "G0100730" | "G0100850" | "G0100910" | "G1901590" | "G0100950" | "G0100970" | "G4804130" | "G0101050" | "G0101090" | "G1901330" | "G0101130" | "G0101290" | "G0101170" | "G0101150" | "G1800310" | "G0101210" | "G0101270" | "G0101250" | "G0500050" | "G0500090" | "G0500430" | "G2901490" | "G0500210" | "G0500170" | "G4200850" | "G0500190" | "G0500310" | "G0500350" | "G0500290" | "G1800270" | "G0500450" | "G0500550" | "G0500690" | "G0500570" | "G0500630" | "G2000350" | "G0501110" | "G0500770" | "G0500850" | "G1901030" | "G0500930" | "G0500870" | "G2000370" | "G1800970" | "G2001310" | "G0501150" | "G2000310" | "G0501190" | "G0501230" | "G0501310" | "G0501430" | "G0501450" | "G1901630" | "G0400010" | "G0400030" | "G0400130" | "G0400050" | "G0400090" | "G0400110" | "G0400190" | "G0400070" | "G0400150" | "G0400250" | "G0400170" | "G0600010" | "G0400210" | "G0400270" | "G1901690" | "G0600070" | "G0600130" | "G1302610" | "G0600690" | "G0600850" | "G0600190" | "G0600550" | "G0600230" | "G0600270" | "G0600310" | "G0600290" | "G0600390" | "G0600370" | "G0600410" | "G0600470" | "G0600450" | "G1201310" | "G0600590" | "G0600950" | "G0600670" | "G0600710" | "G0600730" | "G4001090" | "G0600750" | "G1900950" | "G0600830" | "G0600790" | "G0600810" | "G0600890" | "G0600930" | "G0601010" | "G0600970" | "G0600990" | "G0601030" | "G1200430" | "G0601070" | "G1200310" | "G0601130" | "G0601150" | "G0601110" | "G1201010" | "G1901790" | "G0800010" | "G0801070" | "G0800410" | "G0800290" | "G0800590" | "G1900450" | "G0801110" | "G0800150" | "G0800190" | "G0800310" | "G2100670" | "G0801230" | "G0800210" | "G4201170" | "G2201010" | "G0900090" | "G0900050" | "G1200010" | "G0900110" | "G1901930" | "G0800070" | "G1901950" | "G0800370" | "G0900150" | "G1900990" | "G1000030" | "G1600530" | "G0800690" | "G1700830" | "G0800710" | "G1900490" | "G1200070" | "G1300050" | "G0800430" | "G0800490" | "G0800790" | "G0800510" | "G1700950" | "G0800770" | "G1700970" | "G1900470" | "G0800910" | "G0800650" | "G0800670" | "G0800810" | "G0800930" | "G0800850" | "G0800890" | "G0800970" | "G0801050" | "G0800990" | "G0801130" | "G0900010" | "G1200510" | "G2000990" | "G2000970" | "G0900130" | "G1000010" | "G1000050" | "G1200110" | "G1200330" | "G1700630" | "G1301310" | "G2001790" | "G1201090" | "G1200570" | "G1200530" | "G1200550" | "G2001910" | "G0900070" | "G1200650" | "G1200630" | "G1200890" | "G1700650" | "G1200910" | "G1200250" | "G1200990" | "G1301470" | "G1201030" | "G1201070" | "G1201050" | "G1201110" | "G1201270" | "G1201150" | "G1201170" | "G1200870" | "G1900530" | "G1300170" | "G1300630" | "G1800630" | "G4200110" | "G1300310" | "G1300210" | "G1300390" | "G1300530" | "G1300450" | "G1300510" | "G2000910" | "G1300650" | "G1300670" | "G1300690" | "G1300810" | "G1300930" | "G1800690" | "G1300910" | "G1301610" | "G1901530" | "G1301210" | "G1301150" | "G4802110" | "G1301350" | "G1301330" | "G1301390" | "G1301370" | "G1301490" | "G1301450" | "G1301530" | "G1301590" | "G1301550" | "G2001290" | "G1301730" | "G1301790" | "G1900830" | "G1900570" | "G3101610" | "G1301850" | "G1900590" | "G3101630" | "G2001430" | "G1301990" | "G1301930" | "G1801490" | "G1302150" | "G1302170" | "G1302210" | "G1900850" | "G2001130" | "G1302550" | "G1302590" | "G1800550" | "G1302650" | "G1302450" | "G1302510" | "G1901750" | "G1900610" | "G1900630" | "G1302850" | "G1700730" | "G1302970" | "G1302930" | "G1550035" | "G1550075" | "G1901110" | "G1700790" | "G1901490" | "G1901550" | "G1600190" | "G1600010" | "G1600130" | "G1600110" | "G1600030" | "G1600210" | "G1600230" | "G1600350" | "G1600250" | "G1600310" | "G1600150" | "G1600370" | "G1600410" | "G1600430" | "G1600490" | "G1600450" | "G1600790" | "G1600750" | "G1600590" | "G1600610" | "G1600870" | "G1600570" | "G1600690" | "G2000010" | "G1600710" | "G1600850" | "G1700030" | "G1600830" | "G1700890" | "G1700370" | "G1700310" | "G1700330" | "G2002090" | "G2701410" | "G2000450" | "G1700590" | "G1701410" | "G1700550" | "G1700850" | "G1700990" | "G3400070" | "G1700770" | "G1701030" | "G1701050" | "G2000590" | "G1701310" | "G1701210" | "G1701610" | "G1701510" | "G1701430" | "G1701470" | "G1801090" | "G1701650" | "G1701670" | "G1701890" | "G1701810" | "G1701830" | "G1701930" | "G1701970" | "G1800030" | "G1701990" | "G1800110" | "G1800130" | "G1800510" | "G1800530" | "G1800210" | "G1801390" | "G1801050" | "G1800950" | "G1800830" | "G1800890" | "G1801010" | "G2000290" | "G2901590" | "G1801210" | "G1801110" | "G1801290" | "G1801450" | "G1801570" | "G2000070" | "G2000210" | "G2000150" | "G2000550" | "G2000850" | "G2000570" | "G2000730" | "G2000690" | "G2000610" | "G2000750" | "G2001110" | "G2000810" | "G2001330" | "G2001090" | "G2001370" | "G2001690" | "G2001610" | "G2001750" | "G2001730" | "G3600190" | "G2100510" | "G2002070" | "G2100190" | "G2100050" | "G4804250" | "G2100250" | "G2100270" | "G2901150" | "G2100370" | "G2100830" | "G2100590" | "G2100710" | "G2100730" | "G2100850" | "G2100930" | "G2100950" | "G2101050" | "G2100990" | "G2101210" | "G2101310" | "G2101190" | "G2101850" | "G2101110" | "G2101410" | "G2101330" | "G2101390" | "G5400910" | "G2101670" | "G2101470" | "G2200970" | "G2101770" | "G2101790" | "G2101950" | "G2101930" | "G2200010" | "G2102090" | "G2102110" | "G2102170" | "G2102050" | "G2102190" | "G2102390" | "G2200050" | "G2102370" | "G2200170" | "G2200190" | "G2601210" | "G2700730" | "G2200550" | "G2200450" | "G2200470" | "G2200590" | "G2200570" | "G2200690" | "G2201050" | "G2200650" | "G2300230" | "G2201230" | "G2200770" | "G2200930" | "G2200990" | "G2200870" | "G2200790" | "G2201150" | "G2201090" | "G2201130" | "G2201250" | "G2500030" | "G2500090" | "G2500050" | "G2500010" | "G2400010" | "G2500110" | "G2400230" | "G2400170" | "G2500130" | "G2400250" | "G2500150" | "G2600190" | "G2500250" | "G2500210" | "G2500170" | "G2400330" | "G2500230" | "G2400050" | "G2400090" | "G2400030" | "G2400110" | "G2400210" | "G2400190" | "G2400290" | "G2400310" | "G2500270" | "G2400350" | "G2400370" | "G2300010" | "G2400410" | "G2400430" | "G2400390" | "G2700990" | "G2300030" | "G2300090" | "G2300150" | "G2300070" | "G2300050" | "G2600210" | "G2300310" | "G2600170" | "G2600670" | "G2600750" | "G2300170" | "G2300270" | "G2300190" | "G2600130" | "G2600830" | "G2300290" | "G2600570" | "G2600490" | "G2600530" | "G2600550" | "G2600610" | "G2600710" | "G2600730" | "G2600630" | "G2600990" | "G2600650" | "G2700190" | "G2601110" | "G2601310" | "G2601450" | "G2700110" | "G2601610" | "G2700070" | "G2601630" | "G2700090" | "G2700170" | "G2700010" | "G2700270" | "G2700470" | "G2700750" | "G2700490" | "G2700610" | "G2700670" | "G2700370" | "G2700530" | "G2700770" | "G2700850" | "G2700930" | "G2701110" | "G2700950" | "G2700970" | "G2701230" | "G2900270" | "G2701450" | "G2701490" | "G2701310" | "G2701370" | "G2701570" | "G2701550" | "G2900130" | "G2900230" | "G2900190" | "G2900470" | "G2900370" | "G2900330" | "G2900350" | "G2900950" | "G2900510" | "G2900650" | "G2900690" | "G2901170" | "G2900770" | "G2901130" | "G2901030" | "G2901330" | "G2901510" | "G2901550" | "G2901470" | "G2901610" | "G2901450" | "G2901430" | "G2901830" | "G2902010" | "G2902030" | "G2901890" | "G2902170" | "G2800010" | "G2800630" | "G2800110" | "G2800290" | "G2800270" | "G2800410" | "G2800450" | "G2800490" | "G2800470" | "G2800750" | "G2800510" | "G2800530" | "G2800550" | "G2800210" | "G2800350" | "G2800810" | "G2800710" | "G2800870" | "G2800850" | "G2800930" | "G2800990" | "G4200250" | "G3700710" | "G2801250" | "G2801230" | "G2801130" | "G2801290" | "G2801510" | "G2801330" | "G2801570" | "G2801490" | "G3001070" | "G2801630" | "G3000130" | "G3000070" | "G3000150" | "G3000010" | "G3000030" | "G3000850" | "G3000230" | "G3000170" | "G3000210" | "G3700210" | "G3000410" | "G3700750" | "G3000270" | "G3000310" | "G3701010" | "G3000330" | "G3000350" | "G3000290" | "G3000810" | "G3000390" | "G3000590" | "G3000570" | "G3000490" | "G3000750" | "G3000550" | "G3000830" | "G3000630" | "G3000770" | "G3000670" | "G3000970" | "G3000790" | "G3000930" | "G3000890" | "G3000910" | "G3000950" | "G3000990" | "G3001090" | "G3700510" | "G3500150" | "G3001030" | "G3001050" | "G3700010" | "G3001110" | "G3800010" | "G3700130" | "G3700290" | "G3700370" | "G3701070" | "G3700390" | "G3700530" | "G3700630" | "G3700650" | "G3700570" | "G3700770" | "G3700330" | "G3700810" | "G3100850" | "G3700830" | "G3100870" | "G3700990" | "G3600230" | "G3700970" | "G4001350" | "G3701450" | "G3701190" | "G3701330" | "G3701350" | "G3701290" | "G3701510" | "G3701470" | "G3701550" | "G3701410" | "G3701650" | "G3701730" | "G3701890" | "G3701910" | "G3800030" | "G3701950" | "G3400130" | "G3800090" | "G3800110" | "G3800070" | "G3800170" | "G3800150" | "G3800190" | "G3800230" | "G3800350" | "G3800250" | "G3800330" | "G3800410" | "G3800370" | "G3800490" | "G3800510" | "G3800550" | "G3800530" | "G3800590" | "G3800630" | "G3800570" | "G3800610" | "G3800650" | "G3800710" | "G3800790" | "G3800970" | "G3800890" | "G3801010" | "G3100130" | "G3801050" | "G3100190" | "G3100290" | "G3100330" | "G3600710" | "G3100410" | "G3100470" | "G5500330" | "G3100550" | "G3100790" | "G3100670" | "G3100950" | "G3100990" | "G3101090" | "G3101110" | "G3101270" | "G3101310" | "G3101470" | "G3101590" | "G3101690" | "G3101710" | "G3300110" | "G3400030" | "G3300070" | "G3600730" | "G3300050" | "G3300090" | "G3300150" | "G3400050" | "G3300130" | "G3400150" | "G3400110" | "G3400010" | "G3400210" | "G3400170" | "G3400230" | "G3400310" | "G3400250" | "G3400390" | "G3400410" | "G3400290" | "G3400350" | "G3500030" | "G3500050" | "G3500170" | "G3500010" | "G3500130" | "G3500090" | "G3500190" | "G3500210" | "G3500110" | "G3500230" | "G3500310" | "G3500250" | "G3500350" | "G3500290" | "G3500330" | "G3600410" | "G3200110" | "G3500410" | "G3500490" | "G3500470" | "G3500510" | "G3500390" | "G4500910" | "G4801270" | "G3500530" | "G3500430" | "G3500550" | "G4800730" | "G3600750" | "G3500570" | "G3200090" | "G3500590" | "G3500610" | "G3600010" | "G3200070" | "G3200030" | "G3200130" | "G3600970" | "G3200050" | "G3600810" | "G3200150" | "G3200010" | "G3600370" | "G3200290" | "G3200250" | "G3200230" | "G3600290" | "G3200330" | "G3600050" | "G3600870" | "G3200310" | "G4802670" | "G3600070" | "G3600110" | "G3600150" | "G3600210" | "G3600250" | "G3600830" | "G3600430" | "G3600470" | "G3600550" | "G3600530" | "G3600590" | "G3600450" | "G3600650" | "G3600610" | "G3600950" | "G3600630" | "G3601050" | "G3600670" | "G3600770" | "G3601070" | "G3601090" | "G3601110" | "G3900090" | "G3601030" | "G3601190" | "G3900250" | "G4000190" | "G3900210" | "G3900170" | "G3900230" | "G3900430" | "G3900350" | "G3901390" | "G3900470" | "G3900530" | "G3900410" | "G3900490" | "G3900650" | "G3900670" | "G3900610" | "G3900630" | "G3900790" | "G3901050" | "G3900970" | "G3900950" | "G3901010" | "G3901270" | "G4100270" | "G3901410" | "G3901290" | "G3901450" | "G3901330" | "G3901530" | "G3901590" | "G4001430" | "G4000070" | "G3901670" | "G3901630" | "G4000050" | "G4000110" | "G4000130" | "G4000270" | "G4000170" | "G4000310" | "G4000450" | "G4000250" | "G4000570" | "G4000650" | "G4000470" | "G4000910" | "G4000790" | "G4001110" | "G4000810" | "G4001010" | "G4001030" | "G4001150" | "G4001330" | "G4001390" | "G4001410" | "G4001530" | "G4100050" | "G4001210" | "G4001230" | "G4001450" | "G4001510" | "G4100030" | "G4100070" | "G4200510" | "G4100210" | "G4100010" | "G4100190" | "G4100370" | "G4100230" | "G4100330" | "G4200330" | "G4100170" | "G4100290" | "G4100310" | "G4200490" | "G4100430" | "G4100450" | "G4100410" | "G4200090" | "G4100490" | "G4100390" | "G4100470" | "G4100530" | "G4100570" | "G4200410" | "G4100590" | "G4200430" | "G4201070" | "G4200150" | "G4200450" | "G4200170" | "G4200070" | "G4200030" | "G4200130" | "G4200010" | "G4200650" | "G4200470" | "G4200270" | "G4200290" | "G4200610" | "G4200790" | "G4200870" | "G4200890" | "G4200910" | "G4200550" | "G4200570" | "G4200810" | "G4200830" | "G4200710" | "G4201010" | "G4200950" | "G4201250" | "G4201190" | "G4201110" | "G4600470" | "G4500590" | "G4201290" | "G4201330" | "G4400050" | "G4400070" | "G4400090" | "G4500070" | "G4500350" | "G4500130" | "G4500190" | "G4500210" | "G4500150" | "G4500310" | "G4500270" | "G4500290" | "G4500510" | "G4500410" | "G4601130" | "G4500450" | "G4500610" | "G4500630" | "G4500830" | "G4500750" | "G4600070" | "G4600130" | "G4600190" | "G4600250" | "G4600370" | "G4600310" | "G4600510" | "G4600410" | "G4600450" | "G4600690" | "G4600650" | "G4600590" | "G4600850" | "G4600750" | "G4600810" | "G4601030" | "G4802970" | "G4600950" | "G4601050" | "G4601090" | "G4601150" | "G4601210" | "G4601370" | "G4700010" | "G4601290" | "G4700050" | "G4803750" | "G4700090" | "G4700070" | "G5101710" | "G4700030" | "G4700170" | "G4700190" | "G4700210" | "G4700150" | "G4700130" | "G4700290" | "G4700310" | "G4700470" | "G5101730" | "G4801350" | "G4700350" | "G4700370" | "G4700430" | "G4700590" | "G4700650" | "G4700630" | "G4700710" | "G4801390" | "G4700770" | "G4700890" | "G4700950" | "G4804150" | "G4700930" | "G4800170" | "G4701150" | "G4701050" | "G4800030" | "G4800350" | "G4800210" | "G4701230" | "G4801870" | "G5100370" | "G4801250" | "G4701390" | "G4801290" | "G4701430" | "G4701450" | "G4701730" | "G4801530" | "G4701570" | "G4800530" | "G5100190" | "G5400850" | "G4800750" | "G4701490" | "G4800690" | "G4800130" | "G4804510" | "G4701890" | "G4801030" | "G4802090" | "G4800070" | "G4800290" | "G4801070" | "G4801090" | "G4800410" | "G4800390" | "G4801110" | "G4800430" | "G4800570" | "G4800550" | "G4801170" | "G4801230" | "G4800910" | "G4800610" | "G4800990" | "G4801410" | "G4801650" | "G4801670" | "G5000130" | "G4801830" | "G4801770" | "G4801790" | "G4801750" | "G4801910" | "G4801810" | "G4802010" | "G5501230" | "G4802030" | "G4801970" | "G4802290" | "G4802950" | "G4802190" | "G4802150" | "G4802390" | "G4802270" | "G4802330" | "G4802490" | "G4802450" | "G4802530" | "G4803150" | "G4803170" | "G4803090" | "G4803230" | "G4803330" | "G4803350" | "G4803910" | "G4803210" | "G4803410" | "G4803290" | "G4804710" | "G4803470" | "G4803890" | "G4803670" | "G4803690" | "G4804350" | "G4803650" | "G4803490" | "G4803550" | "G4803570" | "G4803590" | "G4803610" | "G4803770" | "G4803530" | "G4804050" | "G4803930" | "G4803810" | "G4804410" | "G4804530" | "G4804090" | "G4804630" | "G4804790" | "G4804770" | "G4804690" | "G4804890" | "G4804910" | "G4804850" | "G4804870" | "G4805070" | "G4900110" | "G5100330" | "G4900030" | "G4900130" | "G4900070" | "G4900050" | "G4900170" | "G5100130" | "G4900250" | "G4900290" | "G4900350" | "G4900370" | "G4900430" | "G4900390" | "G4900510" | "G4900450" | "G4900530" | "G4900490" | "G5100610" | "G5105100" | "G5100150" | "G5100050" | "G5100010" | "G5100030" | "G5100310" | "G5100470" | "G5105900" | "G5100410" | "G5100570" | "G5100590" | "G5106300" | "G5100690" | "G5100830" | "G5100770" | "G5106600" | "G5100730" | "G5101010" | "G5100950" | "G5101130" | "G5101210" | "G5101310" | "G5101230" | "G5101390" | "G5101430" | "G5101290" | "G5101510" | "G5101470" | "G5101530" | "G5101590" | "G5101630" | "G5101610" | "G5101650" | "G5101790" | "G5101970" | "G5000010" | "G5500430" | "G5101990" | "G5000070" | "G5000050" | "G5000110" | "G5000030" | "G5000150" | "G5000170" | "G5000190" | "G5300230" | "G5300710" | "G5300250" | "G5000250" | "G5000270" | "G5000230" | "G5500370" | "G5000210" | "G5300130" | "G5300150" | "G5500590" | "G5300270" | "G5300330" | "G5300470" | "G5300350" | "G5300410" | "G5300690" | "G5300510" | "G5300670" | "G5500490" | "G5500550" | "G5500210" | "G5501330" | "G5300750" | "G5400030" | "G5400570" | "G5500270" | "G5500130" | "G5300770" | "G5500230" | "G5500250" | "G5500390" | "G5600210" | "G5500710" | "G5500290" | "G5500410" | "G5500450" | "G5500310" | "G5500530" | "G5500570" | "G5500510" | "G5500630" | "G5500670" | "G5400230" | "G5501170" | "G5501150" | "G5500970" | "G5501030" | "G5501370" | "G5400050" | "G5400010" | "G5501290" | "G5400190" | "G5400150" | "G5400270" | "G5400450" | "G5400370" | "G5400470" | "G5400330" | "G5400550" | "G5400490" | "G5400390" | "G5400610" | "G5400590" | "G5400790" | "G5400670" | "G5400830" | "G5401070" | "G5400770" | "G5400930" | "G5600030" | "G5400970" | "G5600010" | "G5600050" | "G5600090" | "G5600110" | "G5600070" | "G5600330" | "G5600250" | "G5600190" | "G5600130" | "G5600150" | "G5600350" | "G5600270" | "G5600370" | "G5600450" | "G5600390" | "G5600410" | "G7200910" | "G7200130" | "G7200150" | "G7200450" | "G7200270" | "G7201130" | "G7200970" | "G7200790" | "G7200190" | "G7200410" | "G7200690" | "G7201250" | "G7200470" | "G7201510" | "G7200810" | "G7201530" | "G7200230" | "G7201310" | "G7200350" | "G7201070" | "G7200550" | "G7200090" | "G7201410" | "G7201270" | "G7200210" | "G7800100" | "G7800200" | "G7800300";
export type StateAbbr = "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA" | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD" | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ" | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC" | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY" | "PR" | "VI";

export interface MakeLink {
  (actions: {type: string; payload?: any}[]): string;
}

export interface MonthTotal {
  y: number;               // year
  m: number;               // month
  t: number;               // count of photographs
  pk?: string;             // photographer key 
}

export interface ProjectedCounty {
  s: string;               // state abbr
  n: string;               // county name
  j: string;               // nhgis_join
  d: string;               // projectedPath
  a?: number | undefined;               // area in square miles // TODO: which is missing area
  c: number;               // number of photos
  l: [number, number];     // projected point for label
}

export interface CountyCounts {
  [index: string]: {        // index is an nhgis_join code
    t: number;              // total photos
    ms?: MonthTotal[];       // totals for month
    photographers?: {
      [index: string]: number; // idnex is the photographerKey, value is number of photos
    };        
  };
}

export interface StyledCounty {
  d: string;              // path data
  name: string;           // county name
  state: string;          // state name
  nhgis_join: string;    
  area_sqmi: number;
  fill: string;
  fillOpacity: number;
  strokeOpacity: number;
  strokeWidth?: number;
  photoCount: number;
  center?: [number, number];
  labelCoords: [number, number];
}

export interface StyledCity {
  cx: number;
  cy: number;
  r: number;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  name: string;
  id: string;
}

export interface ProjectedState {
  abbr: string;
  name: string;
  labelCoords: [number, number];
  bounds: [[number, number], [number, number]];
  d: string;
}

export interface StyledState {
  abbr: string;
  name: string;
  nhgis_join?: string;
  d: string;
  labelCoords: [number, number];
  fillOpacity: number;
}

export interface ElementDimensions {
  width: number;
  height: number;
}

export interface ElementDimensionsWithScale extends ElementDimensions {
  scale: number;
}

export interface SidebarDimensions extends ElementDimensions {
  headerHeight: number;
  photosHeight: number;
}

export interface PhotoCardsDimensions extends ElementDimensions {
  cols: number;
  rows: number;
  displayableCards: number;
  interiorWidth: number;
  interiorHeight: number;
  padding: number;
  margin: number;
  borderWidth: number;
  scale: number;
}

export interface TimelimeHeatmapDimensions extends ElementDimensions {
  leftAxisWidth: number;
  labelsWidth: number;
}

export interface Dimensions {
  calculated: boolean;
  vizCanvas: ElementDimensions;
  map: ElementDimensionsWithScale;
  mapControls: ElementDimensions;
  sidebar: SidebarDimensions;
  photoCards: PhotoCardsDimensions;
  timelineHeatmap: TimelimeHeatmapDimensions;
  selectedPhoto: { height: number};
  similarPhotos: ElementDimensionsWithScale;
  isMobile: boolean;
}

export interface TreemapThemeProps {
  width: number;
  height: number;
  transformX: number;
  transformY: number;
  name: string;
  fill: string;
  fillOpacity: number;
  strokeWidth: number;
  fontColor: string;
  id: string;
  link: string;
  imgSrc: string;
  deemphasize: boolean;
}

export interface TreemapProps {
  timeRange: [number, number];
  filterTerms: string[];
  dimensions: Dimensions;
  selectedTheme: string | null;
  fetchPath: string;
  photosQuery: string;
  makeLink: any;
}

export interface ThemesPlacePhotographerCount {
  [index: string]: number;                       // index is photographerKey
}

export interface ThemesPlaceCount {
  total: number;
  photographers: ThemesPlacePhotographerCount;
  [index: string]: number | ThemesPlacePhotographerCount;
}

export interface ThemesPlace {
  [index: string]: ThemesPlaceCount;            // index is nhgisCode or city key
}

export interface Theme {
  total: number;
  children?: { [index: string] : Theme };
  [index: string]: number | Theme | {};
}

export interface ThemesData {
  counties: ThemesPlace;
  cities: ThemesPlace;
  themes: Theme;
}

export interface ThemePhoto {
  theme: string;
  img: string;
}

export interface AsyncParams {
  isPending: boolean,
  error: any,
  data: any,
}

export interface MapLabelProps {
  label: string;
  x: number;
  y: number;
  fontSize?: number;
}

export interface PlaceCountData {
  k: CityKey | NHGISJoinCode;   // key with ${stateabbr}_${cityname sans whitespace}
  t: number;                    // count of photographs 
  ms?: MonthTotal[];            // totals for months
}

export interface City {
  c?: string;               // city name
  t: number;               // count of photographs
}

export interface CityMetadata {
  k: CityKey;              
  c: string;               // city name
  s: string;               // state name
  lat: number;
  lng: number;
}

export interface VisibleCity extends City {
  k: CityKey;               // key with ${stateabbr}_${cityname sans whitespace}
  s?: string;                // state name
  lat?: number;
  lng?: number;
  otherPlaces?: City[];
  center?: [number, number];
  ms?: MonthTotal[];        // totals for months
}

export interface CountySVGData {
  s: string;                 // state abbr
  n: string;                 // name
  j: string;                 // join nhgisCode
  a: number;                 // araa in square miles
  c: number;                 // number of photos
  l: [number, number];       // label coordinates
  d: string;                 // svg path
  center?: [number, number]
}

export interface MapParameters {
  width: number;
  height: number;
  scale: number;
  translateX: number;
  translateY: number;
  basedOn: string;
}

export interface Centroid {
  center: [number, number];
  dx: number;
  dy: number;
}

export interface CentroidsShape {
  counties: {
    [index: string]: Centroid;
  };
  states: {
    [index: string]: Centroid;
  };
  cities: {
    [index: string]: [number, number];
  }
}

export interface TimelineCell {
  x: number;                    // x position
  year: number;
  month: number;
  width: number;
  height: number;
  fill: string;
  fillOpacity: number;             
}

export interface TimelineYearTick {
  x: number;
  monthHeight: number;
  stroke: string;
}


export interface TimelineRow {
  label: string;
  photographerKey: string;
  firstDate?: number;
  lastDate?: number;
  active: boolean;            // does the photographer have any photos (and is thus selectable) given the current state, e.g. timeRange
  labelX: number;             // x coordinate for the label--don't think this is necessary anymore as they're all on the left
  months: TimelineCell[],
  y: number;                  // y position 
  ySelectable: number;       // y position for the overlapping selectable rect
  monthWidth: number; 
  monthHeight: number;
  labelSize: number,
  yearTicks: TimelineYearTick[];
  showLabel: boolean;
  onHover: (photographerKey: string) => void;
  onUnhover: () => void,
  emphasize: boolean;        // for selected photographer
  fill: string;
  linkTo: string;
  isOther?: boolean;
}

export interface PhotoMetadata {
  photographer_name: string;
  caption: string;
  year: number;
  month: number;
  city: string;
  county: string;
  state: string;
  stateAbbr?: StateAbbr;
  nhgis_join: NHGISJoinCode;
  vanderbilt_level1: string;
  vanderbilt_level2: string;
  vanderbilt_level3: string;
  img_large_path?: string;
  img_thumb_img?: string;
  loc_item_link?: string;
  call_number?: string;
  idx?: number;
  theoffset?: number;
  similarPhotos?: PhotoMetadata[];
  stripPhotos?: PhotoMetadata[];
}

export interface Photographer {
  key: string;
  firstname: string;
  lastname: string;
  count: number;
  firstDate: number;
  lastDate: number;
}

export interface PhotographerMetadata extends Photographer {
  img: string;
  type: "staff" | "nonstaff";
  bio: string[];
  interview?: {
    name: string;
    link: string;
    files: {
      recording: string;
      transcript: string;
    }[];
  };
}

export interface AppState {
  selectedPhotographer: string;
  selectedPhoto: string;
  selectedState: StateAbbr;
  selectedCounty: NHGISJoinCode;
  selectedCity: CityKey;
  selectedTheme: string;
  selectedViz: Viz;
  selectedMapView: MapView;
  filterTerms: string[];
  timeRange: [number, number];
  pathname: string;
  hash: string;
}

type StateFacet = 'lightbox' | 'photo' | 'photographers' | 'ohsearch' | 'themes' | 'timeline' | 'city' | 'county' | 'state' | 'maps' | 'caption';
type ParsedStateFacets = { [SF in StateFacet]?: string };
