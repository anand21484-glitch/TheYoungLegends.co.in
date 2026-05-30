"""Stories for the 16 freedom fighters missing from the original 30-story library.

Schema matches stories_seed.STORIES exactly:
  id, name, title_en, title_hi, tagline_en, tagline_hi, era, color,
  story_en, story_hi, lessons_en, lessons_hi, quiz (list of dicts)

Each quiz item: q_en, q_hi, options_en (list[4]), options_hi (list[4]), answer (int 0-3)
"""

EXTRA_STORIES = [
    # ============================================================
    # 1. Ram Prasad Bismil — UP — HSRA, Kakori, poet
    # ============================================================
    {
        "id": "ram-prasad-bismil",
        "name": "Ram Prasad Bismil",
        "title_en": "Ram Prasad Bismil: The Poet Who Roared",
        "title_hi": "राम प्रसाद बिस्मिल: एक गरजने वाला कवि",
        "tagline_en": "Sarfaroshi ki tamanna — a song that woke up a nation.",
        "tagline_hi": "सरफ़रोशी की तमन्ना — एक गीत जिसने पूरे देश को जगाया।",
        "era": "1897 - 1927",
        "color": "#B91C1C",
        "story_en": (
            "In the small town of Shahjahanpur in Uttar Pradesh, a clever boy named Ram Prasad loved books and poems. "
            "When he grew up, he saw how badly the British treated his people, and a fire started in his heart. "
            "He took the pen-name 'Bismil' — which means 'wounded one' — and wrote thrilling poems that gave courage to every Indian who read them. "
            "His most famous poem began: 'Sarfaroshi ki tamanna ab hamare dil mein hai!' — 'The desire to give our life for our country burns in our heart!' "
            "Bismil joined a group of brave young revolutionaries called the HRA. They needed money to buy guns and books, but they refused to steal from poor people. "
            "So in 1925, with his best friend Ashfaqullah Khan and other warriors, Bismil planned a daring deed — they would rob a TRAIN that was carrying the British government's tax money! "
            "On a moonlit night near Kakori village, the young heroes stopped the train, took only the government's treasure, and ran into the dark forest. "
            "The British were furious. They hunted the brave young men for many months. When Bismil was finally caught, he stood in court without fear and said, "
            "'Our bodies may go, but our ideas will live forever!' At just 30 years old, he was hanged on 19th December 1927. "
            "As the noose tightened, he smiled and recited his beloved poem one final time. His words still inspire millions today."
        ),
        "story_hi": (
            "उत्तर प्रदेश के शाहजहाँपुर शहर में एक होशियार लड़का राम प्रसाद रहता था जिसे किताबें और कविताएँ बहुत पसंद थीं। "
            "जब वह बड़ा हुआ तो उसने देखा कि अंग्रेज़ भारतीयों के साथ कितना बुरा बर्ताव करते हैं, और उसके दिल में आग जल उठी। "
            "उसने अपना उपनाम 'बिस्मिल' रखा — जिसका मतलब है 'घायल' — और ऐसी जोशीली कविताएँ लिखीं जो हर भारतीय को हिम्मत देती थीं। "
            "उसकी सबसे प्रसिद्ध पंक्ति थी: 'सरफ़रोशी की तमन्ना अब हमारे दिल में है!' — यानी 'देश के लिए जान देने की चाह हमारे दिल में जलती है!' "
            "बिस्मिल HRA नामक क्रांतिकारी संगठन में शामिल हो गए। उन्हें बंदूकें और किताबें खरीदने के लिए पैसे चाहिए थे, पर वे ग़रीबों से कभी नहीं लूटते थे। "
            "इसलिए 1925 में, अपने सबसे अच्छे दोस्त अशफ़ाक़उल्लाह खान और अन्य साथियों के साथ, उन्होंने एक साहसी काम किया — उन्होंने अंग्रेज़ी सरकार का खज़ाना ले जा रही ट्रेन को लूट लिया! "
            "चाँदनी रात में काकोरी गाँव के पास युवा वीरों ने ट्रेन रोकी, केवल सरकार का पैसा लिया, और घने जंगल में भाग गए। "
            "अंग्रेज़ बहुत क्रोधित हुए। उन्होंने महीनों तक इन वीरों का पीछा किया। जब बिस्मिल पकड़े गए, वे बिना डरे अदालत में खड़े होकर बोले, "
            "'हमारे शरीर भले मिट जाएँ, लेकिन हमारे विचार हमेशा जीवित रहेंगे!' केवल 30 साल की उम्र में 19 दिसंबर 1927 को उन्हें फाँसी दे दी गई। "
            "जब फंदा कस रहा था, वे मुस्कुराए और अपनी प्यारी कविता फिर से पढ़ी। उनके शब्द आज भी करोड़ों लोगों को प्रेरणा देते हैं।"
        ),
        "lessons_en": [
            "Words and poetry can be as powerful as weapons.",
            "Always be honest — even revolutionaries had rules they would not break.",
            "True courage means smiling even in the face of danger.",
            "Hindu and Muslim friends fought side by side for India.",
        ],
        "lessons_hi": [
            "शब्द और कविता हथियारों जितने ही शक्तिशाली हो सकते हैं।",
            "हमेशा ईमानदार रहो — क्रांतिकारियों के भी अपने उसूल थे।",
            "असली हिम्मत खतरे के सामने भी मुस्कुराना है।",
            "हिंदू-मुसलमान दोस्त भारत के लिए कंधे से कंधा मिलाकर लड़े।",
        ],
        "quiz": [
            {"q_en": "What was Ram Prasad's pen-name?", "q_hi": "राम प्रसाद का उपनाम क्या था?",
             "options_en": ["Azad", "Bismil", "Bhagat", "Veer"], "options_hi": ["आज़ाद", "बिस्मिल", "भगत", "वीर"], "answer": 1},
            {"q_en": "Which famous train robbery did he lead in 1925?", "q_hi": "1925 में उन्होंने कौन सी ट्रेन डकैती की?",
             "options_en": ["Kakori", "Lucknow", "Delhi", "Jhansi"], "options_hi": ["काकोरी", "लखनऊ", "दिल्ली", "झाँसी"], "answer": 0},
            {"q_en": "Who was Bismil's best friend?", "q_hi": "बिस्मिल का सबसे अच्छा दोस्त कौन था?",
             "options_en": ["Bhagat Singh", "Ashfaqullah Khan", "Sukhdev", "Rajguru"],
             "options_hi": ["भगत सिंह", "अशफ़ाक़उल्लाह खान", "सुखदेव", "राजगुरु"], "answer": 1},
            {"q_en": "What does 'Sarfaroshi ki tamanna' mean?", "q_hi": "'सरफ़रोशी की तमन्ना' का क्या अर्थ है?",
             "options_en": ["Desire for money", "Desire to give life for country", "Desire to travel", "Desire to sing"],
             "options_hi": ["पैसे की चाह", "देश पर जान देने की चाह", "घूमने की चाह", "गाने की चाह"], "answer": 1},
            {"q_en": "At what age was Bismil hanged?", "q_hi": "किस उम्र में बिस्मिल को फाँसी दी गई?",
             "options_en": ["20", "25", "30", "40"], "options_hi": ["20", "25", "30", "40"], "answer": 2},
        ],
    },

    # ============================================================
    # 2. Ashfaqullah Khan — UP — Hindu-Muslim unity, Kakori
    # ============================================================
    {
        "id": "ashfaqulla-khan",
        "name": "Ashfaqullah Khan",
        "title_en": "Ashfaqullah Khan: The Heart of Friendship",
        "title_hi": "अशफ़ाक़उल्लाह खान: दोस्ती का दिल",
        "tagline_en": "A Muslim son of India who gave his life for Mother India.",
        "tagline_hi": "भारत का एक मुस्लिम बेटा जिसने भारत माता के लिए जान दे दी।",
        "era": "1900 - 1927",
        "color": "#15803D",
        "story_en": (
            "In Shahjahanpur, a kind-hearted boy named Ashfaqullah Khan grew up loving poetry, horses, and his country. "
            "He believed Hindus and Muslims were two strong hands of the same Mother India. "
            "When he met the poet-revolutionary Ram Prasad Bismil, they became inseparable friends — like brothers from different mothers. "
            "Ashfaqullah joined the secret group of freedom fighters. He helped plan the famous Kakori train robbery in 1925, "
            "where they took only British government money to fund the freedom struggle. "
            "When the British arrested everyone, Ashfaqullah escaped first. He could have fled to safety, but he refused to live free while his friends were in jail. "
            "Sadly, he was betrayed by someone he trusted, and the British caught him too. In court, the British tried to break his friendship with Bismil by saying, "
            "'You are a Muslim — why fight for a Hindu cause?' Ashfaqullah laughed bravely and replied, "
            "'I am an Indian first! Bismil is my dearest brother. We will die together, smiling.' "
            "On 19th December 1927, just hours after Bismil was hanged, Ashfaqullah Khan walked to the gallows with peace in his heart. "
            "At only 27, this gentle giant became one of India's most beloved martyrs — a shining proof that love for India is bigger than any religion."
        ),
        "story_hi": (
            "शाहजहाँपुर में अशफ़ाक़उल्लाह खान नाम का एक दयालु लड़का बड़ा हुआ, जिसे शायरी, घोड़े और अपना देश बहुत पसंद थे। "
            "वह मानते थे कि हिंदू और मुसलमान एक ही भारत माता के दो मज़बूत हाथ हैं। "
            "जब उनकी मुलाकात कवि-क्रांतिकारी राम प्रसाद बिस्मिल से हुई, तो वे जिगरी दोस्त बन गए — सगे भाइयों जैसे। "
            "अशफ़ाक़ क्रांतिकारियों के गुप्त संगठन में शामिल हो गए। 1925 की प्रसिद्ध काकोरी ट्रेन डकैती की योजना बनाने में उन्होंने मदद की, "
            "जिसमें केवल अंग्रेज़ी सरकार का पैसा स्वतंत्रता संग्राम के लिए लिया गया। "
            "जब अंग्रेज़ों ने सबको पकड़ा, अशफ़ाक़ पहले बच निकले। वे सुरक्षित जगह जा सकते थे, पर उन्होंने मना कर दिया कि दोस्त जेल में हों और वे आज़ाद घूमें। "
            "दुख की बात है, एक भरोसेमंद ने उन्हें धोखा दिया, और अंग्रेज़ों ने उन्हें भी पकड़ लिया। अदालत में अंग्रेज़ों ने उनकी दोस्ती तोड़ने की कोशिश की, "
            "'तुम मुसलमान हो — हिंदुओं के लिए क्यों लड़ रहे हो?' अशफ़ाक़ बहादुरी से हँसे और बोले, "
            "'मैं पहले एक भारतीय हूँ! बिस्मिल मेरे सबसे प्यारे भाई हैं। हम मुस्कुराते हुए एक साथ मरेंगे।' "
            "19 दिसंबर 1927 को, बिस्मिल को फाँसी देने के कुछ ही घंटे बाद, अशफ़ाक़उल्लाह खान शांत मन से फाँसी की ओर चले। "
            "केवल 27 साल की उम्र में यह कोमल नायक भारत के सबसे प्रिय शहीदों में से एक बन गए।"
        ),
        "lessons_en": [
            "True friendship knows no religion.",
            "Stand by your friends even in the hardest times.",
            "Being Indian is bigger than being from any one religion.",
            "Loyalty is the most precious gift you can give.",
        ],
        "lessons_hi": [
            "सच्ची दोस्ती धर्म नहीं देखती।",
            "मुश्किल समय में भी अपने दोस्तों का साथ दो।",
            "भारतीय होना किसी एक धर्म से बड़ा है।",
            "वफ़ादारी सबसे क़ीमती तोहफ़ा है।",
        ],
        "quiz": [
            {"q_en": "Who was Ashfaqullah's closest friend?", "q_hi": "अशफ़ाक़ का सबसे करीबी दोस्त कौन था?",
             "options_en": ["Bhagat Singh", "Bismil", "Azad", "Rajguru"], "options_hi": ["भगत सिंह", "बिस्मिल", "आज़ाद", "राजगुरु"], "answer": 1},
            {"q_en": "What was Ashfaqullah's religion?", "q_hi": "अशफ़ाक़ का धर्म क्या था?",
             "options_en": ["Hindu", "Muslim", "Christian", "Sikh"], "options_hi": ["हिंदू", "मुसलमान", "ईसाई", "सिख"], "answer": 1},
            {"q_en": "What did he say in court when asked why he fought?", "q_hi": "अदालत में उन्होंने क्या कहा?",
             "options_en": ["I am Muslim first", "I am Indian first", "I want money", "I want fame"],
             "options_hi": ["मैं पहले मुसलमान हूँ", "मैं पहले भारतीय हूँ", "मुझे पैसा चाहिए", "मुझे शोहरत चाहिए"], "answer": 1},
            {"q_en": "When was Ashfaqullah hanged?", "q_hi": "अशफ़ाक़ को कब फाँसी दी गई?",
             "options_en": ["1925", "1927", "1930", "1947"], "options_hi": ["1925", "1927", "1930", "1947"], "answer": 1},
            {"q_en": "Which train robbery did he take part in?", "q_hi": "उन्होंने कौन सी ट्रेन डकैती में भाग लिया?",
             "options_en": ["Kakori", "Lucknow", "Bombay", "Madras"], "options_hi": ["काकोरी", "लखनऊ", "बंबई", "मद्रास"], "answer": 0},
        ],
    },

    # ============================================================
    # 3. Kunwar Singh — Bihar — 80yo warrior of 1857
    # ============================================================
    {
        "id": "kunwar-singh",
        "name": "Kunwar Singh",
        "title_en": "Veer Kunwar Singh: The Tiger of Bihar",
        "title_hi": "वीर कुंवर सिंह: बिहार का बाघ",
        "tagline_en": "Eighty years old, one sword arm, and still he made the British tremble.",
        "tagline_hi": "अस्सी साल की उम्र, एक तलवारबाज़ हाथ, फिर भी उन्होंने अंग्रेज़ों को कँपा दिया।",
        "era": "1777 - 1858",
        "color": "#7C2D12",
        "story_en": (
            "In a small kingdom called Jagdishpur in Bihar lived a wise old king named Kunwar Singh. "
            "He was already EIGHTY YEARS OLD when the Great Indian Uprising of 1857 began — when soldiers and farmers across India rose up against British rule. "
            "Most people his age would be resting in their gardens. But Kunwar Singh picked up his sword, jumped on his horse, and shouted, "
            "'Bihar will not bow to anyone!' He led his small army to victory after victory, surprising the British again and again. "
            "Once, while crossing a wide river on a tiny boat, a British bullet hit his arm. The wound was very serious. "
            "To save his life from poison, the brave old warrior took out his sword and chopped off his own injured arm — without a sound! "
            "He threw it into the holy Ganga as an offering and kept fighting with his other arm. He was so tough, the British couldn't believe it. "
            "Kunwar Singh chased the British out of his kingdom and rode back to his palace in triumph. "
            "Days later, the wounded warrior breathed his last in his own home, having lived for one final mission — freedom. "
            "Even today, every April 23rd, Bihar celebrates 'Vijay Diwas' — Victory Day — in honor of this incredible grandfather who refused to grow old in his fight for India."
        ),
        "story_hi": (
            "बिहार के जगदीशपुर नामक छोटे राज्य में कुंवर सिंह नाम के एक बुद्धिमान बूढ़े राजा रहते थे। "
            "जब 1857 का महान विद्रोह शुरू हुआ, तब वे पहले ही अस्सी साल के थे — पूरे भारत में सिपाहियों और किसानों ने ब्रिटिश राज के विरुद्ध बग़ावत की। "
            "उनकी उम्र के अधिकांश लोग अपने बाग में आराम कर रहे होते। पर कुंवर सिंह ने तलवार उठाई, घोड़े पर सवार हुए, और चिल्लाए, "
            "'बिहार किसी के सामने नहीं झुकेगा!' उन्होंने अपनी छोटी सेना को बार-बार जीत दिलाई। "
            "एक बार एक चौड़ी नदी पार करते समय अंग्रेज़ की गोली उनके हाथ में लगी। घाव बहुत गहरा था। "
            "ज़हर से अपनी जान बचाने के लिए, बहादुर वीर ने अपनी ही तलवार से अपना घायल हाथ बिना आवाज़ किए काट डाला! "
            "उन्होंने उसे पवित्र गंगा में अर्पित किया और दूसरे हाथ से लड़ते रहे। अंग्रेज़ हैरान रह गए। "
            "कुंवर सिंह ने अंग्रेज़ों को अपने राज्य से बाहर निकाला और विजयी होकर अपने महल लौटे। "
            "कुछ दिनों बाद वीर योद्धा ने अपने घर में अंतिम साँस ली। हर साल 23 अप्रैल को बिहार 'विजय दिवस' मनाता है।"
        ),
        "lessons_en": [
            "Age is just a number — courage is forever.",
            "Sometimes you must make hard sacrifices for what is right.",
            "Never give up, even when wounded.",
            "Defend your homeland with everything you have.",
        ],
        "lessons_hi": [
            "उम्र केवल एक संख्या है — हिम्मत हमेशा रहती है।",
            "कभी-कभी सही के लिए कठिन त्याग करना पड़ता है।",
            "घायल होने पर भी हार मत मानो।",
            "अपनी मातृभूमि की रक्षा अपनी पूरी ताकत से करो।",
        ],
        "quiz": [
            {"q_en": "How old was Kunwar Singh in 1857?", "q_hi": "1857 में कुंवर सिंह कितने साल के थे?",
             "options_en": ["40", "60", "80", "100"], "options_hi": ["40", "60", "80", "100"], "answer": 2},
            {"q_en": "Where was his kingdom?", "q_hi": "उनका राज्य कहाँ था?",
             "options_en": ["Jagdishpur, Bihar", "Jhansi, UP", "Bombay", "Mysore"],
             "options_hi": ["जगदीशपुर, बिहार", "झाँसी, यूपी", "बंबई", "मैसूर"], "answer": 0},
            {"q_en": "What did he do when his arm got injured?", "q_hi": "हाथ घायल होने पर उन्होंने क्या किया?",
             "options_en": ["Cried", "Surrendered", "Cut it off himself", "Ran away"],
             "options_hi": ["रोए", "हार मानी", "खुद काट डाला", "भाग गए"], "answer": 2},
            {"q_en": "Where did he throw his cut arm?", "q_hi": "कटा हाथ कहाँ फेंका?",
             "options_en": ["A field", "The Ganga river", "His palace", "The sky"],
             "options_hi": ["खेत में", "गंगा नदी में", "अपने महल में", "आसमान में"], "answer": 1},
            {"q_en": "When does Bihar celebrate Vijay Diwas for him?", "q_hi": "बिहार उनके लिए विजय दिवस कब मनाता है?",
             "options_en": ["15 August", "26 January", "23 April", "2 October"],
             "options_hi": ["15 अगस्त", "26 जनवरी", "23 अप्रैल", "2 अक्टूबर"], "answer": 2},
        ],
    },

    # ============================================================
    # 4. Tara Rani Srivastava — Bihar — Quit India, carried flag
    # ============================================================
    {
        "id": "tara-rani-srivastava",
        "name": "Tara Rani Srivastava",
        "title_en": "Tara Rani: The Wife Who Carried the Flag",
        "title_hi": "तारा रानी: वो पत्नी जिसने झंडा थामे रखा",
        "tagline_en": "When her husband fell, she picked up the tricolor and marched on.",
        "tagline_hi": "जब उनके पति गिरे, उन्होंने तिरंगा उठाया और आगे बढ़ती रहीं।",
        "era": "Born 1900s",
        "color": "#BE185D",
        "story_en": (
            "In a small village called Saran in Bihar lived a brave young woman named Tara Rani. "
            "When Mahatma Gandhi started the Quit India movement in 1942, calling on every Indian to demand freedom, "
            "Tara Rani and her husband Phulendu Babu joined the protest with shining eyes and full hearts. "
            "On 12th August 1942, they led a huge group of villagers towards the local police station, planning to plant the Indian tricolor on its roof. "
            "Tara Rani walked at the front with the flag in her hands. Her husband marched beside her. "
            "Suddenly, British policemen opened fire on the peaceful protesters! Bullets flew everywhere. "
            "Phulendu Babu was hit and fell to the ground, badly wounded. Tara Rani's heart broke into pieces — but she did not stop. "
            "She quickly bandaged her husband, gently kissed his forehead, and said, 'Forgive me — our country needs me right now.' "
            "Then she lifted the tricolor higher and led the march all the way to the police station! "
            "She climbed up, planted the flag, and the crowd cheered like thunder. "
            "Only when the protest was over did Tara Rani run back to her husband. Sadly, he had already left to be with the stars. "
            "Tara Rani never remarried. She spent her whole life serving India quietly — a true silent heroine of our freedom."
        ),
        "story_hi": (
            "बिहार के सारण नामक एक छोटे गाँव में तारा रानी नाम की एक बहादुर युवती रहती थीं। "
            "जब 1942 में महात्मा गांधी ने भारत छोड़ो आंदोलन शुरू किया, "
            "तारा रानी और उनके पति फूलेंदु बाबू चमकती आँखों के साथ आंदोलन में शामिल हो गए। "
            "12 अगस्त 1942 को वे गाँव वालों के एक बड़े समूह को थाने की ओर ले गए, जहाँ वे तिरंगा फहराने वाले थे। "
            "तारा रानी हाथ में झंडा लिए सबसे आगे चल रही थीं। पति उनके बग़ल में थे। "
            "अचानक अंग्रेज़ी पुलिस ने शांतिपूर्ण प्रदर्शनकारियों पर गोलियाँ चलाईं! फूलेंदु बाबू बुरी तरह घायल होकर गिर पड़े। "
            "तारा रानी का दिल टूट गया — पर उन्होंने रुकने से मना कर दिया। "
            "उन्होंने पति को जल्दी से पट्टी बाँधी, माथे को प्यार से चूमा, और बोलीं, 'मुझे माफ़ करना — देश को मेरी ज़रूरत है।' "
            "फिर उन्होंने तिरंगा ऊँचा उठाया और जुलूस को थाने तक ले गईं! "
            "उन्होंने झंडा फहराया और भीड़ ने जोश से जयकारा लगाया। "
            "जब आंदोलन ख़त्म हुआ तब तारा रानी पति के पास भागीं। दुखद रूप से वे जा चुके थे। "
            "तारा रानी ने दोबारा शादी नहीं की। उन्होंने अपना पूरा जीवन चुपचाप भारत की सेवा में बिताया।"
        ),
        "lessons_en": [
            "Duty to country can be greater than personal sorrow.",
            "Women are equal partners in the freedom struggle.",
            "True heroes are sometimes silent and forgotten.",
            "Carry on the mission even when your heart is broken.",
        ],
        "lessons_hi": [
            "देश का कर्तव्य निजी दुख से बड़ा हो सकता है।",
            "महिलाएँ स्वतंत्रता संग्राम में बराबर की साथी हैं।",
            "सच्चे नायक कभी-कभी चुप और गुमनाम होते हैं।",
            "दिल टूटे पर भी मिशन जारी रखो।",
        ],
        "quiz": [
            {"q_en": "Where was Tara Rani from?", "q_hi": "तारा रानी कहाँ की थीं?",
             "options_en": ["Saran, Bihar", "Pune, Maharashtra", "Mysore", "Delhi"],
             "options_hi": ["सारण, बिहार", "पुणे, महाराष्ट्र", "मैसूर", "दिल्ली"], "answer": 0},
            {"q_en": "Which movement did she join?", "q_hi": "उन्होंने कौन सा आंदोलन ज्वाइन किया?",
             "options_en": ["Quit India 1942", "Salt March 1930", "Kakori 1925", "Khilafat"],
             "options_hi": ["भारत छोड़ो 1942", "नमक यात्रा 1930", "काकोरी 1925", "ख़िलाफ़त"], "answer": 0},
            {"q_en": "What did she carry in the march?", "q_hi": "जुलूस में उन्होंने क्या उठाया था?",
             "options_en": ["A drum", "The tricolor flag", "A gun", "A book"],
             "options_hi": ["ढोल", "तिरंगा झंडा", "बंदूक", "किताब"], "answer": 1},
            {"q_en": "What did she do when her husband fell?", "q_hi": "पति के गिरने पर उन्होंने क्या किया?",
             "options_en": ["Stopped the march", "Bandaged him and led on", "Ran home", "Surrendered"],
             "options_hi": ["जुलूस रोका", "पट्टी बाँधी और जुलूस चलाती रहीं", "घर भागीं", "हार मानी"], "answer": 1},
            {"q_en": "Did she remarry?", "q_hi": "क्या उन्होंने दोबारा शादी की?",
             "options_en": ["Yes", "No", "Twice", "Three times"], "options_hi": ["हाँ", "नहीं", "दो बार", "तीन बार"], "answer": 1},
        ],
    },

    # ============================================================
    # 5. Aurobindo Ghosh — WB — Yogi-revolutionary, Bande Mataram
    # ============================================================
    {
        "id": "aurobindo-ghosh",
        "name": "Aurobindo Ghosh",
        "title_en": "Aurobindo Ghosh: The Yogi Revolutionary",
        "title_hi": "अरविंद घोष: योगी क्रांतिकारी",
        "tagline_en": "First he lit the fire of freedom, then he found the light of the soul.",
        "tagline_hi": "पहले उन्होंने आज़ादी की आग जलाई, फिर आत्मा का प्रकाश पाया।",
        "era": "1872 - 1950",
        "color": "#7E22CE",
        "story_en": (
            "Aurobindo Ghosh was born in Kolkata to a wealthy family. As a small boy he was sent to England, where he studied at the finest schools. "
            "But while everyone praised his English manners, his heart secretly beat for India. He read books on Indian history and philosophy in the cold libraries of London, "
            "and a dream began to grow — to free his motherland from foreign rule. "
            "Back in India, he became a brilliant teacher, writer, and editor. He started a fiery newspaper called 'Bande Mataram' which gave wings to a generation of young patriots. "
            "He also helped a secret group called Anushilan Samiti, where brave young Indians trained their bodies and minds to fight the British. "
            "In 1908, the British arrested Aurobindo and threw him into Alipore Jail. They tried to break his spirit with a long, scary trial. "
            "But something amazing happened in that tiny prison cell — Aurobindo had powerful spiritual experiences. He felt the divine presence everywhere. "
            "When he was finally set free, he was a changed soul. He moved to the French town of Pondicherry, where he spent the rest of his life as a great yogi, teacher, and philosopher. "
            "His writings still guide millions to find inner peace. Aurobindo showed us that the fight for freedom can begin in the streets and end in the soul."
        ),
        "story_hi": (
            "अरविंद घोष का जन्म कोलकाता के एक धनी परिवार में हुआ था। बचपन में ही उन्हें इंग्लैंड पढ़ने भेजा गया। "
            "हर कोई उनके अंग्रेज़ी शिष्टाचार की तारीफ़ करता था, पर उनका दिल भारत के लिए धड़कता था। उन्होंने लंदन के पुस्तकालयों में भारतीय इतिहास पढ़ा, "
            "और एक सपना बढ़ने लगा — अपनी मातृभूमि को आज़ाद कराने का। "
            "भारत लौटकर वे एक तेजस्वी शिक्षक, लेखक और संपादक बन गए। उन्होंने 'बंदे मातरम्' नाम का जोशीला अख़बार शुरू किया जिसने नए देशभक्तों को पंख दिए। "
            "उन्होंने 'अनुशीलन समिति' नामक गुप्त संगठन की भी मदद की, जिसमें बहादुर युवा अंग्रेज़ों से लड़ने का प्रशिक्षण पाते थे। "
            "1908 में अंग्रेज़ों ने अरविंद को गिरफ़्तार किया और अलीपुर जेल में डाल दिया। "
            "उस छोटी सी कोठरी में कुछ अद्भुत हुआ — अरविंद को शक्तिशाली आध्यात्मिक अनुभव हुए। उन्हें हर जगह दिव्यता का अहसास हुआ। "
            "जब वे आज़ाद हुए, वे बदले हुए इंसान थे। वे पुडुचेरी चले गए, जहाँ बाकी जीवन एक महान योगी, शिक्षक और दार्शनिक के रूप में बिताया।"
        ),
        "lessons_en": [
            "Patriotism can grow even far from home.",
            "Books and writing can change a whole nation.",
            "Quiet moments — even in prison — can lead to great wisdom.",
            "The journey from action to peace is a beautiful one.",
        ],
        "lessons_hi": [
            "देशभक्ति घर से दूर भी पनप सकती है।",
            "किताबें और लेखन पूरे देश को बदल सकते हैं।",
            "जेल जैसी जगहों में भी ज्ञान मिल सकता है।",
            "कर्म से शांति तक की यात्रा सुंदर है।",
        ],
        "quiz": [
            {"q_en": "Where was Aurobindo educated?", "q_hi": "अरविंद ने कहाँ पढ़ाई की?",
             "options_en": ["India only", "England", "France", "America"],
             "options_hi": ["केवल भारत", "इंग्लैंड", "फ़्रांस", "अमेरिका"], "answer": 1},
            {"q_en": "What was the name of his newspaper?", "q_hi": "उनके अख़बार का नाम क्या था?",
             "options_en": ["Young India", "Bande Mataram", "Kesari", "Free Press"],
             "options_hi": ["यंग इंडिया", "बंदे मातरम्", "केसरी", "फ्री प्रेस"], "answer": 1},
            {"q_en": "Which secret group did he help?", "q_hi": "उन्होंने किस गुप्त संगठन की मदद की?",
             "options_en": ["HRA", "Anushilan Samiti", "INC", "Khaksars"],
             "options_hi": ["HRA", "अनुशीलन समिति", "कांग्रेस", "ख़ाक़सार"], "answer": 1},
            {"q_en": "Where did he live in his later years?", "q_hi": "बाद में वे कहाँ रहे?",
             "options_en": ["Kolkata", "Mumbai", "Pondicherry", "Delhi"],
             "options_hi": ["कोलकाता", "मुंबई", "पुडुचेरी", "दिल्ली"], "answer": 2},
            {"q_en": "In which jail did he have spiritual experiences?", "q_hi": "किस जेल में उन्हें आध्यात्मिक अनुभव हुए?",
             "options_en": ["Alipore", "Tihar", "Cellular", "Yerawada"],
             "options_hi": ["अलीपुर", "तिहाड़", "सेल्युलर", "येरवडा"], "answer": 0},
        ],
    },

    # ============================================================
    # 6. Veer Surendra Sai — Odisha — 37 years in jail
    # ============================================================
    {
        "id": "veer-surendra-sai",
        "name": "Veer Surendra Sai",
        "title_en": "Veer Surendra Sai: The Forever Fighter",
        "title_hi": "वीर सुरेंद्र साय: कभी न हारने वाला योद्धा",
        "tagline_en": "Thirty-seven years in jail and he never said sorry to the British.",
        "tagline_hi": "37 साल जेल में रहे पर अंग्रेज़ों से कभी माफ़ी नहीं माँगी।",
        "era": "1809 - 1884",
        "color": "#0F766E",
        "story_en": (
            "In the green hills of Sambalpur in Odisha lived a strong young prince named Surendra Sai. "
            "By right, he should have become the king after his grandfather. But the British took over and put a different person on the throne. "
            "Surendra Sai was furious. He gathered his tribal brothers and friends and declared war on the British when he was just 18 years old! "
            "Using clever guerrilla tactics, he hid in the dense forests and attacked British soldiers like a tiger striking from the shadows. "
            "The British couldn't catch him for many years. When they finally tricked him into capture, they threw him into Hazaribagh Jail. "
            "But the brave warrior didn't sit quietly. When the great 1857 uprising began, Surendra Sai escaped from jail along with his fellow prisoners and went straight back to fighting! "
            "For another 7 years, he kept the British army on its toes. Finally captured again, he was sent to the dreaded Asirgarh Fort — far from his beloved Odisha. "
            "There he spent the rest of his life as a prisoner, slowly losing his eyesight but never his fighting spirit. "
            "He spent a total of THIRTY-SEVEN years in jail and never once asked the British for mercy. "
            "Today Odisha calls him 'Veer' — the Brave — because he proved that some lions would rather rot in chains than live as slaves."
        ),
        "story_hi": (
            "ओडिशा के सम्बलपुर की हरी पहाड़ियों में सुरेंद्र साय नाम का एक मज़बूत युवा राजकुमार रहता था। "
            "अधिकार से उन्हें राजा बनना चाहिए था, लेकिन अंग्रेज़ों ने किसी और को गद्दी पर बैठा दिया। "
            "सुरेंद्र साय बहुत क्रोधित हुए। उन्होंने अपने आदिवासी भाइयों को इकट्ठा किया और केवल 18 साल की उम्र में अंग्रेज़ों के विरुद्ध युद्ध की घोषणा कर दी! "
            "उन्होंने चालाक छापामार युद्ध से घने जंगलों में छुपकर अंग्रेज़ी सिपाहियों पर वार किया, जैसे बाघ अंधेरे से वार करता है। "
            "अंग्रेज़ कई सालों तक उन्हें पकड़ नहीं सके। जब चालाकी से पकड़ा, हज़ारीबाग़ जेल में डाल दिया। "
            "1857 के विद्रोह के समय सुरेंद्र साय जेल से भागे और सीधे फिर से लड़ाई पर चले गए! "
            "7 और साल लड़ाई चली। अंत में पकड़े जाने पर उन्हें असीरगढ़ क़िले भेज दिया गया — अपनी प्यारी ओडिशा से बहुत दूर। "
            "वहाँ उन्होंने जीवन का बाकी हिस्सा क़ैदी के रूप में बिताया, धीरे-धीरे आँखें खोते गए पर लड़ाई का जज़्बा कभी नहीं। "
            "उन्होंने कुल 37 साल जेल में बिताए और एक बार भी अंग्रेज़ों से माफ़ी नहीं माँगी।"
        ),
        "lessons_en": [
            "Some heroes fight their whole lives without ever winning.",
            "Forests can hide brave warriors better than castles.",
            "Real freedom begins inside your mind, even if your body is in chains.",
            "Standing up for your right place is worth any price.",
        ],
        "lessons_hi": [
            "कुछ नायक पूरी ज़िंदगी लड़ते हैं बिना जीते।",
            "जंगल बहादुरों को क़िले से बेहतर छुपाते हैं।",
            "असली आज़ादी मन में होती है, ज़ंजीर में भी।",
            "अपने हक़ के लिए खड़ा होना हर क़ीमत के बराबर है।",
        ],
        "quiz": [
            {"q_en": "From which state was Surendra Sai?", "q_hi": "सुरेंद्र साय किस राज्य से थे?",
             "options_en": ["Odisha", "Bengal", "Bihar", "Assam"], "options_hi": ["ओडिशा", "बंगाल", "बिहार", "असम"], "answer": 0},
            {"q_en": "How many years did he spend in jail in total?", "q_hi": "कुल कितने साल जेल में बिताए?",
             "options_en": ["7", "17", "27", "37"], "options_hi": ["7", "17", "27", "37"], "answer": 3},
            {"q_en": "At what age did he begin fighting the British?", "q_hi": "किस उम्र में अंग्रेज़ों से लड़ना शुरू किया?",
             "options_en": ["12", "15", "18", "25"], "options_hi": ["12", "15", "18", "25"], "answer": 2},
            {"q_en": "Where was his final prison?", "q_hi": "उनकी अंतिम जेल कहाँ थी?",
             "options_en": ["Cellular", "Hazaribagh", "Asirgarh Fort", "Yerawada"],
             "options_hi": ["सेल्युलर", "हज़ारीबाग़", "असीरगढ़ क़िला", "येरवडा"], "answer": 2},
            {"q_en": "What war tactic did he use?", "q_hi": "उन्होंने कौन सी रणनीति अपनाई?",
             "options_en": ["Open battle", "Guerrilla / forest", "Sieges", "Sea attacks"],
             "options_hi": ["खुली लड़ाई", "छापामार / जंगल", "घेराबंदी", "समुद्री हमले"], "answer": 1},
        ],
    },

    # ============================================================
    # 7. Bhima Bhoi — Odisha — Blind poet philosopher
    # ============================================================
    {
        "id": "bhima-bhoi",
        "name": "Bhima Bhoi",
        "title_en": "Bhima Bhoi: The Blind Poet Who Saw Everything",
        "title_hi": "भीम भोई: नेत्रहीन कवि जिसने सब कुछ देखा",
        "tagline_en": "His eyes saw no light, but his songs lit up an entire people.",
        "tagline_hi": "उनकी आँखें नहीं देख सकती थीं, पर उनके गीतों ने पूरी जनता को जगाया।",
        "era": "1850 - 1895",
        "color": "#9333EA",
        "story_en": (
            "Long ago in the green forests of Odisha, a little tribal boy named Bhima Bhoi was born blind. "
            "His parents were very poor, and people often laughed at him. But Bhima Bhoi had a gift the world could not see — a heart full of songs. "
            "From a young age, he sang beautiful poems about love, equality, and the suffering of the common people under cruel landlords and the British. "
            "Even though he could not read or write, his memory was as sharp as a diamond. He would compose long, soulful songs and teach them to whoever would listen. "
            "Bhima Bhoi believed that ALL humans were equal — no caste, no high, no low. He joined the new 'Mahima Dharma' faith, which preached one God and brotherhood. "
            "His most famous line was: 'Mo jeebana pacche narke padithau, jagata uddhara heu' — 'Let me suffer in hell forever, if it means the world can be saved!' "
            "What a gigantic heart for one small blind boy from the jungle! His songs spread from village to village, giving courage to tribal people, low-caste families, and the poor. "
            "Even though he never raised a sword, Bhima Bhoi shook the foundations of unfair traditions and inspired generations to demand dignity and freedom."
        ),
        "story_hi": (
            "बहुत समय पहले ओडिशा के हरे जंगलों में भीम भोई नाम का एक छोटा आदिवासी लड़का जन्म से नेत्रहीन था। "
            "उसके माता-पिता बहुत ग़रीब थे, और लोग अक्सर उसका मज़ाक उड़ाते थे। पर भीम भोई के पास एक तोहफ़ा था — गीतों से भरा दिल। "
            "छोटी उम्र से ही वे प्यार, समानता, और ग़रीबों के दुख पर सुंदर कविताएँ गाते थे। "
            "वे पढ़-लिख नहीं सकते थे, पर उनकी याददाश्त हीरे जैसी तेज़ थी। वे लंबे, भावुक गीत बनाते और जो भी सुनना चाहे उसे सिखाते। "
            "भीम भोई मानते थे कि सभी इंसान बराबर हैं — कोई जाति नहीं, कोई ऊँचा नहीं, कोई नीचा नहीं। वे 'महिमा धर्म' से जुड़े जो एक ईश्वर और भाईचारे की बात करता था। "
            "उनकी सबसे प्रसिद्ध पंक्ति थी: 'मेरा जीवन नर्क में बीते, पर संसार का उद्धार हो!' "
            "उनके गीत गाँव-गाँव फैले और आदिवासियों, ग़रीबों और दलितों को हिम्मत दी।"
        ),
        "lessons_en": [
            "What you cannot see with eyes, you can see with your heart.",
            "Songs and poems can change the world.",
            "All human beings are equal — caste cannot define worth.",
            "True greatness is wishing good for others, even at your own cost.",
        ],
        "lessons_hi": [
            "जो आँखों से नहीं देख सकते, वह दिल से देख लेते हैं।",
            "गीत और कविताएँ दुनिया बदल सकती हैं।",
            "सभी इंसान बराबर हैं — जाति महत्व नहीं बताती।",
            "दूसरों का भला चाहना ही सच्ची महानता है।",
        ],
        "quiz": [
            {"q_en": "What was unique about Bhima Bhoi from birth?", "q_hi": "जन्म से भीम भोई में क्या ख़ास था?",
             "options_en": ["He was deaf", "He was blind", "He couldn't speak", "He was lame"],
             "options_hi": ["बहरे थे", "नेत्रहीन थे", "बोल नहीं सकते थे", "लंगड़े थे"], "answer": 1},
            {"q_en": "From which state was he?", "q_hi": "वे किस राज्य से थे?",
             "options_en": ["Odisha", "Bihar", "Bengal", "Assam"], "options_hi": ["ओडिशा", "बिहार", "बंगाल", "असम"], "answer": 0},
            {"q_en": "Which religion/path did he join?", "q_hi": "वे किस धर्म से जुड़े?",
             "options_en": ["Buddhism", "Mahima Dharma", "Sikhism", "Jainism"],
             "options_hi": ["बौद्ध", "महिमा धर्म", "सिख", "जैन"], "answer": 1},
            {"q_en": "Could he read or write?", "q_hi": "क्या वे पढ़-लिख सकते थे?",
             "options_en": ["Yes, both", "No, neither", "Only read", "Only write"],
             "options_hi": ["हाँ दोनों", "नहीं कोई नहीं", "केवल पढ़ना", "केवल लिखना"], "answer": 1},
            {"q_en": "What did he believe about all humans?", "q_hi": "उन्होंने सभी इंसानों के बारे में क्या माना?",
             "options_en": ["Some are higher", "All are equal", "Only kings are great", "Only priests"],
             "options_hi": ["कुछ ऊँचे हैं", "सभी बराबर हैं", "केवल राजा महान", "केवल पंडित"], "answer": 1},
        ],
    },

    # ============================================================
    # 8. Uyyalawada Narasimha Reddy — AP — Early rebel
    # ============================================================
    {
        "id": "uyyalawada-narasimha-reddy",
        "name": "Uyyalawada Narasimha Reddy",
        "title_en": "Uyyalawada Narasimha Reddy: India's First Spark",
        "title_hi": "उय्यालवाडा नरसिंह रेड्डी: भारत की पहली चिंगारी",
        "tagline_en": "He rebelled against the British SIXTY years before 1857!",
        "tagline_hi": "उन्होंने 1857 से 60 साल पहले अंग्रेज़ों के विरुद्ध बग़ावत की!",
        "era": "1806 - 1847",
        "color": "#DC2626",
        "story_en": (
            "Long before most Indians realized how cruel the British East India Company was, a fearless young chieftain named Narasimha Reddy was already fighting back. "
            "He lived in the rocky village of Uyyalawada in Andhra Pradesh and was the leader of a small kingdom. "
            "The British company took over his lands and stopped paying him the small pension his ancestors had been promised. "
            "They started squeezing taxes out of starving farmers and treating his people like dust under their boots. "
            "Narasimha Reddy could not bear it. In 1846 — sixty whole years before the famous 1857 uprising! — he raised the flag of revolt. "
            "With about 5,000 brave villagers, he attacked British treasury offices, freed prisoners, and chased away the East India Company's officers. "
            "He moved swiftly through the rocky hills, where the British soldiers could not follow easily. For months he was an invisible storm. "
            "Sadly, a traitor revealed his hiding place, and Narasimha Reddy was captured. "
            "On 22nd February 1847, he was publicly hanged in his own village. The British thought hanging him would scare the people forever — but they were wrong. "
            "Narasimha Reddy's brave example became the first flame, lighting the way for thousands of freedom fighters who would come later."
        ),
        "story_hi": (
            "ज़्यादातर भारतीयों को अंग्रेज़ी ईस्ट इंडिया कंपनी की क्रूरता का पता चलने से बहुत पहले, "
            "आंध्र प्रदेश के उय्यालवाडा गाँव के एक निडर युवा सरदार नरसिंह रेड्डी ने उनसे लड़ाई शुरू कर दी थी। "
            "अंग्रेज़ कंपनी ने उनकी ज़मीन छीन ली और पुश्तैनी पेंशन देना बंद कर दिया। "
            "वे भूखे किसानों से ज़बरदस्ती लगान वसूलते और लोगों के साथ बहुत बुरा बर्ताव करते थे। "
            "नरसिंह रेड्डी सहन नहीं कर सके। 1846 में — 1857 के विद्रोह से 60 साल पहले! — उन्होंने बग़ावत का झंडा उठाया। "
            "लगभग 5,000 बहादुर ग्रामीणों के साथ उन्होंने अंग्रेज़ी ख़ज़ानों पर हमला किया, क़ैदियों को आज़ाद कराया, और कंपनी अधिकारियों को भगाया। "
            "वे पथरीली पहाड़ियों में तेज़ी से चलते जहाँ अंग्रेज़ नहीं जा सकते थे। महीनों तक वे एक अदृश्य तूफ़ान थे। "
            "एक ग़द्दार ने उनका छिपने का स्थान बता दिया और वे पकड़े गए। "
            "22 फरवरी 1847 को उन्हें अपने ही गाँव में सरेआम फाँसी दे दी गई। पर उनकी मिसाल पहली चिंगारी बनी।"
        ),
        "lessons_en": [
            "Bravery does not wait for permission.",
            "Sometimes you are too early — but your example lights the path.",
            "Hills and rocks can hide warriors better than walls.",
            "Even small kingdoms can stand up to big empires.",
        ],
        "lessons_hi": [
            "बहादुरी अनुमति का इंतज़ार नहीं करती।",
            "कभी आप बहुत जल्दी होते हो — पर मिसाल बन जाते हो।",
            "पहाड़ियाँ क़िलों से बेहतर छुपाती हैं।",
            "छोटे राज्य भी बड़े साम्राज्यों के सामने खड़े हो सकते हैं।",
        ],
        "quiz": [
            {"q_en": "When did Narasimha Reddy revolt?", "q_hi": "नरसिंह रेड्डी ने कब बग़ावत की?",
             "options_en": ["1846", "1857", "1900", "1942"], "options_hi": ["1846", "1857", "1900", "1942"], "answer": 0},
            {"q_en": "From which state was he?", "q_hi": "वे किस राज्य से थे?",
             "options_en": ["Andhra Pradesh", "Tamil Nadu", "Kerala", "Karnataka"],
             "options_hi": ["आंध्र प्रदेश", "तमिलनाडु", "केरल", "कर्नाटक"], "answer": 0},
            {"q_en": "Why did he revolt?", "q_hi": "उन्होंने क्यों बग़ावत की?",
             "options_en": ["For money", "For unjust taxes & lost pension", "For revenge", "For fame"],
             "options_hi": ["पैसे के लिए", "अन्यायी लगान और छिनी पेंशन के लिए", "बदले के लिए", "नाम के लिए"], "answer": 1},
            {"q_en": "About how many villagers fought with him?", "q_hi": "उनके साथ कितने ग्रामीण लड़े?",
             "options_en": ["50", "500", "5,000", "50,000"], "options_hi": ["50", "500", "5,000", "50,000"], "answer": 2},
            {"q_en": "How was he caught?", "q_hi": "वे कैसे पकड़े गए?",
             "options_en": ["Direct battle", "By a traitor", "Surrendered", "Got sick"],
             "options_hi": ["सीधी लड़ाई", "एक ग़द्दार ने पकड़वाया", "हार मानी", "बीमार पड़े"], "answer": 1},
        ],
    },

    # ============================================================
    # 9. Abbakka Chowta — Karnataka — Queen of Ullal
    # ============================================================
    {
        "id": "abbakka-chowta",
        "name": "Abbakka Chowta",
        "title_en": "Abbakka Chowta: The Fearless Queen of the Sea",
        "title_hi": "अब्बक्का चौटा: समुद्र की निडर रानी",
        "tagline_en": "She fought the Portuguese for forty years — and never lost her crown.",
        "tagline_hi": "उन्होंने 40 साल पुर्तगालियों से लड़कर अपना ताज नहीं खोया।",
        "era": "1525 - 1570",
        "color": "#0891B2",
        "story_en": (
            "Long before the British arrived in India, the powerful Portuguese fleet was conquering coast after coast. "
            "But on India's beautiful western shore, in a tiny kingdom called Ullal in Karnataka, ruled a queen who would not bend — Abbakka Chowta. "
            "Queen Abbakka was wise, brave, and a master of warfare. She trained her army of fishermen and farmers in archery, swordplay, and naval combat. "
            "She also did something very rare for her time — she united Hindus, Muslims, and Jains in her army, saying, 'In this kingdom, we are all Indians.' "
            "When the Portuguese demanded heavy taxes from her, Abbakka laughed and said, 'I bow only to the gods, not to invaders!' "
            "The Portuguese sent their mighty ships and well-armed soldiers to attack Ullal. But Abbakka was always one step ahead. "
            "She used something amazing — small clay pots filled with FIRE — that her soldiers threw onto Portuguese ships, burning their grand sails! "
            "For over forty years, again and again, the Portuguese tried to capture Ullal — and again and again, Queen Abbakka chased them back into the sea. "
            "She was finally captured through betrayal, but even in prison she fought, dying like a true warrior. "
            "Today, Karnataka calls her 'Abhaya Rani' — the Fearless Queen — the woman who proved that one small kingdom and one brave queen could humble the world's biggest empire."
        ),
        "story_hi": (
            "अंग्रेज़ों के भारत आने से बहुत पहले, शक्तिशाली पुर्तगाली बेड़ा भारतीय तटों को जीत रहा था। "
            "पर पश्चिमी तट पर कर्नाटक के उल्लाल नामक छोटे राज्य में एक रानी राज करती थीं जो कभी नहीं झुकीं — अब्बक्का चौटा। "
            "रानी अब्बक्का बुद्धिमती, बहादुर और युद्ध कौशल में निपुण थीं। उन्होंने मछुआरों और किसानों की सेना को धनुर्विद्या और तलवारबाज़ी सिखाई। "
            "वे हिंदू, मुस्लिम और जैन — सबको अपनी सेना में बराबरी से रखती थीं। "
            "जब पुर्तगालियों ने भारी कर माँगा, अब्बक्का हँसकर बोलीं, 'मैं केवल देवताओं को सिर झुकाती हूँ, हमलावरों को नहीं!' "
            "पुर्तगालियों ने अपने विशाल जहाज़ भेजे। पर अब्बक्का हर बार एक क़दम आगे रहीं। "
            "उन्होंने अनोखे आग के मिट्टी के घड़ों का प्रयोग किया जो पुर्तगाली जहाज़ों के पाल को जला देते थे! "
            "40 साल तक पुर्तगालियों ने उल्लाल पर हमले किए, हर बार उन्हें समुद्र में वापस भेजा गया। "
            "अंत में धोखे से पकड़ी गईं, पर जेल में भी लड़ती रहीं। आज कर्नाटक उन्हें 'अभय रानी' कहकर सम्मान देता है।"
        ),
        "lessons_en": [
            "A small kingdom with a brave heart can defeat huge armies.",
            "Unity among different religions makes any army stronger.",
            "Clever ideas — like fire arrows — beat brute strength.",
            "Some queens never surrender, no matter how big the enemy.",
        ],
        "lessons_hi": [
            "बहादुर दिल वाला छोटा राज्य बड़ी सेनाएँ हरा सकता है।",
            "धर्मों की एकता हर सेना को मज़बूत बनाती है।",
            "चतुर बुद्धि बल को हरा देती है।",
            "कुछ रानियाँ कभी हार नहीं मानतीं।",
        ],
        "quiz": [
            {"q_en": "Where was Abbakka's kingdom?", "q_hi": "अब्बक्का का राज्य कहाँ था?",
             "options_en": ["Ullal, Karnataka", "Mysore", "Jhansi", "Travancore"],
             "options_hi": ["उल्लाल, कर्नाटक", "मैसूर", "झाँसी", "त्रावणकोर"], "answer": 0},
            {"q_en": "Which European power did she fight?", "q_hi": "किन यूरोपीय लोगों से लड़ीं?",
             "options_en": ["British", "Portuguese", "French", "Dutch"],
             "options_hi": ["अंग्रेज़", "पुर्तगाली", "फ़्रांसीसी", "डच"], "answer": 1},
            {"q_en": "For how many years did she resist them?", "q_hi": "कितने सालों तक प्रतिरोध किया?",
             "options_en": ["4 years", "14 years", "40+ years", "100 years"],
             "options_hi": ["4 साल", "14 साल", "40+ साल", "100 साल"], "answer": 2},
            {"q_en": "What clever weapon did she use against ships?", "q_hi": "जहाज़ों पर कौन सा अनोखा हथियार चलाया?",
             "options_en": ["Spears", "Fire pots", "Cannons", "Magic"],
             "options_hi": ["भाले", "आग के घड़े", "तोप", "जादू"], "answer": 1},
            {"q_en": "Whom did she unite in her army?", "q_hi": "अपनी सेना में किसे एकजुट किया?",
             "options_en": ["Only Hindus", "Only Jains", "Hindus, Muslims, Jains", "Only soldiers"],
             "options_hi": ["केवल हिंदू", "केवल जैन", "हिंदू, मुस्लिम, जैन", "केवल सिपाही"], "answer": 2},
        ],
    },

    # ============================================================
    # 10. Pazhassi Raja — Kerala — Lion of Kerala
    # ============================================================
    {
        "id": "pazhassi-raja",
        "name": "Pazhassi Raja",
        "title_en": "Pazhassi Raja: The Lion of Kerala",
        "title_hi": "पझस्सी राजा: केरल का शेर",
        "tagline_en": "From the green forests of Wayanad, a king fought the British like a lion.",
        "tagline_hi": "वायनाड के हरे जंगलों से एक राजा अंग्रेज़ों से शेर की तरह लड़ा।",
        "era": "1753 - 1805",
        "color": "#16A34A",
        "story_en": (
            "In the cool green hills of Wayanad in Kerala lived a brave young king named Pazhassi Raja. "
            "He loved his land — the spice gardens, the elephant herds, the ancient temples, and most of all, his tribal friends who lived in the deep forests. "
            "When the British East India Company tried to take over his kingdom and put heavy taxes on his people, Pazhassi Raja refused to bow down. "
            "He gathered his tribal warriors — the brave Kurichiyas — armed them with bows, arrows, and elephant traps, and disappeared into the thick jungles. "
            "From there, he attacked British soldiers like a leopard in the dark. The British generals were used to fighting on open plains — but in Pazhassi's forest, they were lost and afraid. "
            "For more than a decade, Pazhassi Raja kept the British army running in circles. Even when his palace was burned, his queen captured, and his treasures stolen, he refused to surrender. "
            "Finally, after many betrayals, he was cornered in a forest hollow near Mavila Thode. "
            "Rather than be captured by the enemy, this proud lion-king chose to die on his own terms — some say by swallowing a diamond. "
            "His brave queen burned his body herself, with full royal honors. "
            "Today Kerala remembers Pazhassi Raja as the Kerala Simham — 'the Lion of Kerala' — the king who showed that forests and friends are stronger than guns and gold."
        ),
        "story_hi": (
            "केरल के वायनाड की ठंडी हरी पहाड़ियों में पझस्सी राजा नाम का एक बहादुर युवा राजा रहता था। "
            "उन्हें अपनी ज़मीन से बहुत प्यार था — मसालों के बगीचे, हाथियों के झुंड, प्राचीन मंदिर, और जंगलों के आदिवासी दोस्त। "
            "जब अंग्रेज़ी कंपनी ने उनका राज्य लेना चाहा और भारी कर लगाया, पझस्सी राजा ने झुकने से इनकार कर दिया। "
            "उन्होंने बहादुर कुरीचिया आदिवासी योद्धाओं को इकट्ठा किया, उन्हें धनुष-बाण और हाथी-जाल दिए, और घने जंगलों में छुप गए। "
            "वहाँ से वे अंग्रेज़ी सिपाहियों पर तेंदुए की तरह वार करते थे। अंग्रेज़ खुले मैदान में लड़ने के आदी थे — पर पझस्सी के जंगल में डर जाते थे। "
            "10 साल से ज़्यादा पझस्सी राजा ने अंग्रेज़ी सेना को परेशान किया। महल जला, रानी पकड़ी गई, ख़ज़ाना लूटा गया — फिर भी उन्होंने हार नहीं मानी। "
            "अंत में कई धोखों के बाद, माविला थोड़े के पास जंगल में घेरे गए। "
            "दुश्मन के हाथ पड़ने से बेहतर शान से मरना — उन्होंने हीरा निगलकर प्राण त्याग दिए। "
            "केरल आज भी उन्हें 'केरल सिंहम' — 'केरल का शेर' — कहकर याद करता है।"
        ),
        "lessons_en": [
            "Tribal friends and forest brothers are the strongest allies.",
            "Sometimes the best fighters disappear before they strike.",
            "Even a small kingdom can frustrate a huge empire.",
            "A true king dies with his honor, not his crown.",
        ],
        "lessons_hi": [
            "आदिवासी दोस्त सबसे मज़बूत साथी होते हैं।",
            "कभी-कभी सबसे अच्छे योद्धा वार से पहले अदृश्य हो जाते हैं।",
            "छोटा राज्य भी बड़े साम्राज्य को परेशान कर सकता है।",
            "सच्चा राजा अपने सम्मान के साथ मरता है।",
        ],
        "quiz": [
            {"q_en": "From which state was Pazhassi Raja?", "q_hi": "पझस्सी राजा किस राज्य से थे?",
             "options_en": ["Kerala", "Karnataka", "Tamil Nadu", "Andhra"],
             "options_hi": ["केरल", "कर्नाटक", "तमिलनाडु", "आंध्र"], "answer": 0},
            {"q_en": "Which tribal warriors fought with him?", "q_hi": "कौन से आदिवासी योद्धा उनके साथ लड़े?",
             "options_en": ["Gonds", "Kurichiyas", "Bhils", "Nagas"],
             "options_hi": ["गोंड", "कुरीचिया", "भील", "नागा"], "answer": 1},
            {"q_en": "Which place did he use as his battle base?", "q_hi": "किस जगह को युद्ध का अड्डा बनाया?",
             "options_en": ["Cities", "Forests of Wayanad", "Beaches", "Mountains of Himalayas"],
             "options_hi": ["शहर", "वायनाड के जंगल", "समुद्र तट", "हिमालय"], "answer": 1},
            {"q_en": "What is his title?", "q_hi": "उनकी उपाधि क्या है?",
             "options_en": ["Lion of Punjab", "Lion of Kerala", "Tiger of Mysore", "King of Hills"],
             "options_hi": ["पंजाब का शेर", "केरल का शेर", "मैसूर का बाघ", "पहाड़ों का राजा"], "answer": 1},
            {"q_en": "How did he end his life?", "q_hi": "उन्होंने जीवन कैसे समाप्त किया?",
             "options_en": ["Surrendered", "Battle wound", "By own choice (legend: diamond)", "Old age"],
             "options_hi": ["हार मानी", "युद्ध में घाव", "अपनी मर्ज़ी से (हीरा निगलकर)", "बुढ़ापे में"], "answer": 2},
        ],
    },

    # ============================================================
    # 11. Kattabomman — Tamil Nadu
    # ============================================================
    {
        "id": "kattabomman",
        "name": "Veerapandiya Kattabomman",
        "title_en": "Kattabomman: The Brave Chieftain Who Said NO",
        "title_hi": "कट्टाबोम्मन: 'नहीं' कहने वाला बहादुर सरदार",
        "tagline_en": "'Why should I pay tax to people who don't even own this land?'",
        "tagline_hi": "'जो इस ज़मीन के मालिक नहीं उन्हें मैं कर क्यों दूँ?'",
        "era": "1760 - 1799",
        "color": "#EA580C",
        "story_en": (
            "In the dry red lands of Panchalankurichi in Tamil Nadu lived a tall, mustachioed warrior-chieftain named Veerapandiya Kattabomman. "
            "He was the Polygar — a kind of small king — who ruled his region with kindness and respect for his farmers. "
            "When the British East India Company arrived and demanded heavy taxes from him, Kattabomman stood tall in front of the British officer and asked, "
            "'Who are you to ask for tax? You didn't make the rain. You didn't grow the crops. You didn't plant the trees. Why should we pay YOU?' "
            "The British were furious! But Kattabomman did not back down. He gathered other Polygars, formed a brave southern army, and prepared to fight. "
            "In a tense meeting at Ramnad Fort, things turned violent and the British Collector was killed. The British now wanted Kattabomman's head. "
            "They sent thousands of soldiers and cannons against his small army. Kattabomman fought bravely from his fort but was forced to escape into the forests. "
            "After being betrayed by a fellow chieftain, he was finally captured. "
            "On 16th October 1799, the British hanged him from a tamarind tree in Kayathar village in front of his people, hoping to scare them forever. "
            "But Kattabomman's last words — 'Long live my country!' — became a flame that never died in Tamil hearts. "
            "He was one of the very first Indians to say a loud, proud 'NO' to the British. Even today, his fort and his tamarind tree stand as proud monuments."
        ),
        "story_hi": (
            "तमिलनाडु के पंचालंकुरीची की लाल मिट्टी में वीरपांड्य कट्टाबोम्मन नाम के एक लंबे, बड़ी मूँछों वाले योद्धा-सरदार रहते थे। "
            "वे एक पॉलिगार थे — छोटे राजा — जो अपने इलाके पर दयालुता से शासन करते थे। "
            "जब अंग्रेज़ी कंपनी ने भारी कर माँगा, कट्टाबोम्मन ने अंग्रेज़ अफ़सर के सामने खड़े होकर कहा, "
            "'तुम कौन हो कर माँगने वाले? न तुमने बारिश की, न फ़सल उगाई, न पेड़ लगाए। हम तुम्हें कर क्यों दें?' "
            "अंग्रेज़ बहुत क्रोधित हुए! पर कट्टाबोम्मन झुके नहीं। उन्होंने अन्य पॉलिगारों को इकट्ठा किया और दक्षिणी सेना बनाई। "
            "रामनद क़िले की बैठक में हिंसा भड़की और अंग्रेज़ कलेक्टर मारा गया। अब अंग्रेज़ कट्टाबोम्मन का सिर चाहते थे। "
            "उन्होंने हज़ारों सिपाही और तोप भेजे। कट्टाबोम्मन क़िले से बहादुरी से लड़े पर जंगल भागना पड़ा। "
            "एक साथी सरदार ने धोखा दिया और वे पकड़े गए। "
            "16 अक्टूबर 1799 को अंग्रेज़ों ने उन्हें कायथार गाँव के एक इमली के पेड़ पर लोगों के सामने फाँसी दे दी। "
            "उनके अंतिम शब्द — 'मेरा देश ज़िंदाबाद!' — तमिल दिलों में अमर हो गए।"
        ),
        "lessons_en": [
            "You can question unfair authority with dignity.",
            "Speaking the truth is sometimes more powerful than swords.",
            "Local heroes are India's first heroes.",
            "Trees and forts can stand as silent witnesses to courage.",
        ],
        "lessons_hi": [
            "अन्याय पर सम्मान से सवाल उठाओ।",
            "सच बोलना तलवार से ज़्यादा ताकतवर है।",
            "स्थानीय नायक देश के पहले नायक होते हैं।",
            "पेड़ और क़िले बहादुरी के मूक साक्षी होते हैं।",
        ],
        "quiz": [
            {"q_en": "From which region was Kattabomman?", "q_hi": "कट्टाबोम्मन कहाँ से थे?",
             "options_en": ["Tamil Nadu", "Kerala", "Karnataka", "Andhra"],
             "options_hi": ["तमिलनाडु", "केरल", "कर्नाटक", "आंध्र"], "answer": 0},
            {"q_en": "Why did he refuse to pay tax?", "q_hi": "उन्होंने कर देने से क्यों मना किया?",
             "options_en": ["He was rich", "British didn't own the land", "He forgot", "His army said no"],
             "options_hi": ["वे अमीर थे", "अंग्रेज़ ज़मीन के मालिक नहीं थे", "भूल गए", "सेना ने मना किया"], "answer": 1},
            {"q_en": "What was his title?", "q_hi": "उनकी उपाधि क्या थी?",
             "options_en": ["Polygar (chieftain)", "Maharaja", "Sultan", "Diwan"],
             "options_hi": ["पॉलिगार (सरदार)", "महाराजा", "सुल्तान", "दीवान"], "answer": 0},
            {"q_en": "Where was he hanged?", "q_hi": "उन्हें कहाँ फाँसी दी गई?",
             "options_en": ["Madurai", "Chennai", "Kayathar (tamarind tree)", "Madras Fort"],
             "options_hi": ["मदुरै", "चेन्नई", "कायथार (इमली पेड़)", "मद्रास क़िला"], "answer": 2},
            {"q_en": "When was he executed?", "q_hi": "कब फाँसी दी गई?",
             "options_en": ["1799", "1857", "1900", "1942"], "options_hi": ["1799", "1857", "1900", "1942"], "answer": 0},
        ],
    },

    # ============================================================
    # 12. Puli Thevar — TN — Earliest anti-British leader
    # ============================================================
    {
        "id": "puli-thevar",
        "name": "Puli Thevar",
        "title_en": "Puli Thevar: The Tiger Before the Storm",
        "title_hi": "पुली थेवर: तूफ़ान से पहले का बाघ",
        "tagline_en": "Long before others dared, this Tamil chieftain roared 'NO' to the British.",
        "tagline_hi": "औरों से पहले इस तमिल सरदार ने अंग्रेज़ों को 'नहीं' कहा।",
        "era": "1715 - 1767",
        "color": "#854D0E",
        "story_en": (
            "Puli Thevar was a fierce warrior-chieftain who ruled the hill region of Nerkattumseval in Tamil Nadu. "
            "'Puli' means 'tiger' in Tamil — and Puli Thevar truly lived up to his name. He had sharp eyes, a quick sword, and a heart full of fire for his land. "
            "Long before most Indians had even heard of the British East India Company, Puli Thevar saw that these foreigners were trying to take over the south of India. "
            "When the Nawab of Arcot — who worked under the British — demanded tax money, Puli Thevar refused. "
            "'I am the master of my hills, and I bow to no foreign company,' he declared. "
            "He raised a small but fierce army and waged war against the combined forces of the Nawab and the British, who sent their best general Yusuf Khan to crush him. "
            "Puli Thevar fought with brilliant tactics in the rocky valleys. He won several battles and humbled the British more than once. "
            "His fort, Nerkattumseval, became a symbol of resistance for all Tamil chieftains. "
            "Eventually, the British and the Nawab sent overwhelming forces against him. After fierce battles, Puli Thevar was forced to flee, and he disappeared into the forests. "
            "Some say he died there in 1767, but no one knows for sure. Like a true tiger, he vanished into the wild. "
            "Today historians say Puli Thevar was one of the VERY FIRST Indians to fight the British directly. Before Tipu Sultan, before Mangal Pandey, before 1857 — there was this brave tiger of the south."
        ),
        "story_hi": (
            "पुली थेवर तमिलनाडु के नेरकट्टुमसेवल नामक पहाड़ी इलाके के एक उग्र योद्धा-सरदार थे। "
            "'पुली' का तमिल में अर्थ है 'बाघ' — और पुली थेवर सच में अपने नाम पर खरे उतरे। तेज़ आँखें, फुर्तीली तलवार, और देश के लिए जलता दिल। "
            "जब ज़्यादातर भारतीयों ने अंग्रेज़ कंपनी का नाम भी नहीं सुना था, पुली थेवर ने भाँप लिया कि ये विदेशी दक्षिण भारत हड़पना चाहते हैं। "
            "जब अर्कोट के नवाब ने — जो अंग्रेज़ों के नीचे काम करते थे — कर माँगा, पुली थेवर ने मना कर दिया। "
            "'मैं अपनी पहाड़ियों का स्वामी हूँ, किसी विदेशी कंपनी के सामने नहीं झुकूँगा,' उन्होंने घोषणा की। "
            "उन्होंने छोटी पर भयानक सेना बनाई और अंग्रेज़-नवाब के विरुद्ध युद्ध छेड़ा। "
            "पहाड़ी घाटियों में उनकी रणनीति शानदार थी। उन्होंने कई बार अंग्रेज़ों को हराया। "
            "अंत में अंग्रेज़ों ने भारी सेना भेजी। पुली थेवर जंगल में ग़ायब हो गए। "
            "कुछ कहते हैं 1767 में वहीं उनकी मृत्यु हुई। आज इतिहासकार उन्हें भारत के सबसे पहले अंग्रेज़-विरोधी नायकों में गिनते हैं।"
        ),
        "lessons_en": [
            "Sometimes the bravest are the first — even before anyone listens.",
            "Hills and clever planning beat big armies.",
            "Refuse to pay foreigners for what is yours.",
            "Disappear like a tiger, never bow like a slave.",
        ],
        "lessons_hi": [
            "कभी-कभी बहादुर सबसे पहले होते हैं — जब कोई सुनता भी नहीं।",
            "पहाड़ और चतुर योजना बड़ी सेनाओं को हराते हैं।",
            "अपने हक़ के लिए विदेशियों को कर मत दो।",
            "बाघ की तरह ओझल हो जाओ, ग़ुलाम बनकर मत झुको।",
        ],
        "quiz": [
            {"q_en": "What does 'Puli' mean in Tamil?", "q_hi": "तमिल में 'पुली' का क्या अर्थ है?",
             "options_en": ["Lion", "Tiger", "Eagle", "Horse"], "options_hi": ["शेर", "बाघ", "बाज़", "घोड़ा"], "answer": 1},
            {"q_en": "Whom did he refuse tax to?", "q_hi": "उन्होंने किसे कर देने से मना किया?",
             "options_en": ["Mughal Emperor", "Nawab of Arcot (British backed)", "Maratha king", "Village headman"],
             "options_hi": ["मुग़ल बादशाह", "अर्कोट के नवाब (अंग्रेज़ समर्थित)", "मराठा राजा", "मुखिया"], "answer": 1},
            {"q_en": "What was the name of his fort?", "q_hi": "उनके क़िले का नाम क्या था?",
             "options_en": ["Nerkattumseval", "Chittor", "Golconda", "Vellore"],
             "options_hi": ["नेरकट्टुमसेवल", "चित्तौड़", "गोलकोंडा", "वेल्लोर"], "answer": 0},
            {"q_en": "What is special about his place in history?", "q_hi": "उनकी ख़ास बात क्या है?",
             "options_en": ["Last to fight British", "Among earliest to fight British", "Worked for British", "Only writer"],
             "options_hi": ["अंग्रेज़ों से अंत में लड़े", "अंग्रेज़ों से शुरू में लड़े", "अंग्रेज़ों के लिए काम किया", "केवल लेखक"], "answer": 1},
            {"q_en": "How did his life end (legend)?", "q_hi": "उनका अंत कैसे हुआ (किंवदंती)?",
             "options_en": ["Public hanging", "Disappeared into forest", "Old age in palace", "Sea voyage"],
             "options_hi": ["सरेआम फाँसी", "जंगल में ग़ायब", "महल में बुढ़ापे में", "समुद्री यात्रा"], "answer": 1},
        ],
    },

    # ============================================================
    # 13. Kanaklata Barua — Assam — 17yo martyr
    # ============================================================
    {
        "id": "kanaklata-barua",
        "name": "Kanaklata Barua",
        "title_en": "Kanaklata Barua: The Girl Who Held the Flag",
        "title_hi": "कनकलता बरुआ: झंडा थामे रखने वाली लड़की",
        "tagline_en": "Only seventeen — but she would NOT let the tricolor fall.",
        "tagline_hi": "केवल 17 साल की — पर उन्होंने तिरंगा गिरने नहीं दिया।",
        "era": "1924 - 1942",
        "color": "#DB2777",
        "story_en": (
            "Kanaklata Barua was born in a small village in Assam. She lost her mother when she was just five years old. "
            "Life was tough — but Kanaklata grew up to be a quiet, gentle, and very strong young girl. She loved India deeply. "
            "When she was only 17, Mahatma Gandhi called for the Quit India movement, asking every Indian to demand freedom. "
            "Kanaklata's eyes lit up. She decided to lead a peaceful protest in her village of Gohpur. "
            "On 20th September 1942, dressed in white, Kanaklata picked up the Indian tricolor and led a large procession towards the local police station. "
            "Her plan was simple — hoist the flag on the police station and show the British that the people would not stay silent. "
            "When she reached the gates, the British policemen warned her to stop. Kanaklata kept walking, holding the flag higher. "
            "Suddenly, the policemen opened fire! A bullet hit Kanaklata. As she fell to the ground, she did not let go of the flag. "
            "Even with her last breath, she held the tricolor up — and another patriot took it from her hands and ran forward. "
            "Seventeen years old. One flag. One bullet. One forever moment in India's freedom story. "
            "Today Assam remembers Kanaklata as 'Birbala' — the Brave Girl. Roads, schools, and even a warship of the Indian Coast Guard are named after this small, mighty heroine of the northeast."
        ),
        "story_hi": (
            "कनकलता बरुआ असम के एक छोटे गाँव में जन्मीं। 5 साल की उम्र में माँ खो दीं। "
            "जीवन कठिन था — पर वह शांत, कोमल और बहुत मज़बूत युवती बन गईं। उन्हें भारत से गहरा प्यार था। "
            "17 साल की उम्र में, जब गांधी जी ने भारत छोड़ो आंदोलन छेड़ा, कनकलता की आँखें चमक उठीं। "
            "उन्होंने अपने गाँव गोहपुर में शांतिपूर्ण जुलूस निकालने का फ़ैसला किया। "
            "20 सितंबर 1942 को सफ़ेद साड़ी में, कनकलता ने तिरंगा उठाया और एक बड़े जुलूस को थाने की ओर ले गईं। "
            "योजना सरल थी — थाने पर झंडा फहराना। "
            "जब वे फाटक पर पहुँचीं, पुलिस ने रुकने को कहा। कनकलता आगे बढ़ती गईं, झंडा ऊँचा करती गईं। "
            "अचानक पुलिस ने गोली चला दी! एक गोली कनकलता को लगी। गिरते समय भी उन्होंने झंडा नहीं छोड़ा। "
            "अंतिम साँस तक उन्होंने तिरंगा ऊँचा रखा — और दूसरे देशभक्त ने उनके हाथ से लेकर आगे बढ़ाया। "
            "17 साल। एक झंडा। एक गोली। एक अमर पल। आज असम उन्हें 'बीरबाला' कहकर याद करता है।"
        ),
        "lessons_en": [
            "Age does not decide courage.",
            "Even one girl can become a symbol for a whole movement.",
            "Hold what is precious tightly, even when you fall.",
            "The northeast has given India some of its bravest hearts.",
        ],
        "lessons_hi": [
            "उम्र हिम्मत तय नहीं करती।",
            "एक लड़की भी पूरे आंदोलन का प्रतीक बन सकती है।",
            "क़ीमती चीज़ को गिरते समय भी पकड़े रखो।",
            "उत्तर-पूर्व ने भारत को सबसे बहादुर दिल दिए हैं।",
        ],
        "quiz": [
            {"q_en": "How old was Kanaklata when she died?", "q_hi": "कनकलता की मृत्यु किस उम्र में हुई?",
             "options_en": ["13", "17", "21", "25"], "options_hi": ["13", "17", "21", "25"], "answer": 1},
            {"q_en": "From which state was she?", "q_hi": "वे किस राज्य से थीं?",
             "options_en": ["Assam", "Bengal", "Meghalaya", "Bihar"],
             "options_hi": ["असम", "बंगाल", "मेघालय", "बिहार"], "answer": 0},
            {"q_en": "Which movement did she join?", "q_hi": "किस आंदोलन में शामिल हुईं?",
             "options_en": ["Salt March", "Quit India 1942", "Khilafat", "Swadeshi"],
             "options_hi": ["नमक यात्रा", "भारत छोड़ो 1942", "ख़िलाफ़त", "स्वदेशी"], "answer": 1},
            {"q_en": "What did she carry?", "q_hi": "वे क्या ले जा रही थीं?",
             "options_en": ["A sword", "The tricolor flag", "A pamphlet", "A drum"],
             "options_hi": ["तलवार", "तिरंगा झंडा", "पर्चा", "ढोल"], "answer": 1},
            {"q_en": "What is her honorary title?", "q_hi": "उनकी उपाधि क्या है?",
             "options_en": ["Birbala", "Rani", "Bibi", "Devi"], "options_hi": ["बीरबाला", "रानी", "बीबी", "देवी"], "answer": 0},
        ],
    },

    # ============================================================
    # 14. Kushal Konwar — Assam — Quit India martyr
    # ============================================================
    {
        "id": "kushal-konwar",
        "name": "Kushal Konwar",
        "title_en": "Kushal Konwar: The Gentle Hero of Assam",
        "title_hi": "कुशल कोंवर: असम का कोमल नायक",
        "tagline_en": "A teacher, a Gandhian, and the only Quit India martyr hanged in court.",
        "tagline_hi": "एक शिक्षक, एक गांधीवादी, और भारत छोड़ो आंदोलन में फाँसी पाने वाले इकलौते शहीद।",
        "era": "1905 - 1943",
        "color": "#1E40AF",
        "story_en": (
            "Kushal Konwar was a gentle schoolteacher in the green tea-garden town of Sarupathar in Assam. "
            "He loved poetry, his students, and the teachings of Mahatma Gandhi. He always wore simple white khadi and spoke softly. "
            "When the Quit India movement of 1942 began, Kushal stood up for his country. He led local protests and spoke at village meetings, asking the British to leave. "
            "On 10th October 1942, a passenger train derailed near Sarupathar in an act of sabotage by Quit India protesters. The British were furious. "
            "They needed someone to blame and decided to falsely accuse Kushal Konwar — even though he had absolutely nothing to do with the derailment. "
            "Brave Kushal could have lied to save himself. But he stood tall in court and said, 'I am proud to be an Indian. I will not betray my country to save my body.' "
            "He was sentenced to death. As he walked to the gallows on 15th June 1943, he sang Bhagavad Gita verses, his face full of calm. "
            "He became the only person hanged by the British during the entire Quit India movement after a court verdict — a quiet, smiling martyr who chose his country over his life. "
            "Today Assam remembers Kushal Konwar as the gentle giant of the freedom struggle — a teacher who became immortal in the great book of India's independence."
        ),
        "story_hi": (
            "कुशल कोंवर असम के सरुपथार के एक हरे चाय बागान वाले शहर में एक कोमल शिक्षक थे। "
            "उन्हें कविता, अपने छात्र और महात्मा गांधी की शिक्षाएँ बहुत प्रिय थीं। वे सादा सफ़ेद खादी पहनते और धीरे बोलते थे। "
            "1942 के भारत छोड़ो आंदोलन में वे देश के लिए खड़े हो गए। उन्होंने स्थानीय जुलूस निकाले और गाँव की सभाओं में बोले। "
            "10 अक्टूबर 1942 को सरुपथार के पास एक यात्री ट्रेन पटरी से उतर गई — विरोधकर्ताओं का तोड़फोड़। अंग्रेज़ क्रोधित हुए। "
            "किसी पर इल्ज़ाम चाहिए था, उन्होंने कुशल कोंवर पर झूठा आरोप लगाया — जबकि उनका कोई हाथ नहीं था। "
            "कुशल चाहते तो झूठ बोलकर बच सकते थे। पर वे सीना तानकर अदालत में बोले, 'मुझे भारतीय होने पर गर्व है। शरीर बचाने के लिए देश को धोखा नहीं दूँगा।' "
            "मौत की सज़ा सुनाई गई। 15 जून 1943 को फाँसी की ओर जाते समय वे शांति से भगवद गीता गा रहे थे। "
            "वे भारत छोड़ो आंदोलन में अदालती फ़ैसले से फाँसी पाने वाले इकलौते भारतीय थे।"
        ),
        "lessons_en": [
            "Even a gentle person can be a great hero.",
            "Telling the truth is more important than living a lie.",
            "Honesty and courage often walk together.",
            "Teachers shape both minds and nations.",
        ],
        "lessons_hi": [
            "कोमल इंसान भी महान नायक हो सकता है।",
            "झूठ जीने से बेहतर सच बोलना है।",
            "ईमानदारी और हिम्मत साथ चलती हैं।",
            "शिक्षक दिमाग़ और देश दोनों को आकार देते हैं।",
        ],
        "quiz": [
            {"q_en": "What was Kushal Konwar's profession?", "q_hi": "कुशल कोंवर का पेशा क्या था?",
             "options_en": ["Doctor", "Teacher", "Soldier", "Farmer"],
             "options_hi": ["डॉक्टर", "शिक्षक", "सिपाही", "किसान"], "answer": 1},
            {"q_en": "Which movement was he part of?", "q_hi": "वे किस आंदोलन का हिस्सा थे?",
             "options_en": ["Khilafat", "Quit India 1942", "Salt March", "Swadeshi"],
             "options_hi": ["ख़िलाफ़त", "भारत छोड़ो 1942", "नमक यात्रा", "स्वदेशी"], "answer": 1},
            {"q_en": "Was he actually guilty of the train sabotage?", "q_hi": "क्या वे वाक़ई दोषी थे?",
             "options_en": ["Yes", "No, falsely blamed", "Maybe", "Partly"],
             "options_hi": ["हाँ", "नहीं, झूठा आरोप", "शायद", "थोड़ा-थोड़ा"], "answer": 1},
            {"q_en": "What did he sing on the way to gallows?", "q_hi": "फाँसी पर जाते समय क्या गाया?",
             "options_en": ["National anthem", "Bhagavad Gita verses", "A folk song", "Nothing"],
             "options_hi": ["राष्ट्र गीत", "भगवद गीता के श्लोक", "लोकगीत", "कुछ नहीं"], "answer": 1},
            {"q_en": "What is unique about his martyrdom?", "q_hi": "उनकी शहादत में क्या ख़ास है?",
             "options_en": ["Youngest martyr", "Only hanged by court in Quit India", "Oldest martyr", "Hanged in foreign land"],
             "options_hi": ["सबसे छोटे शहीद", "भारत छोड़ो में अदालती फाँसी पाने वाले इकलौते", "सबसे बूढ़े शहीद", "विदेश में फाँसी"], "answer": 1},
        ],
    },

    # ============================================================
    # 15. U Tirot Sing — Meghalaya — Khasi resistance
    # ============================================================
    {
        "id": "tirot-sing",
        "name": "U Tirot Sing",
        "title_en": "U Tirot Sing: The King of the Hills",
        "title_hi": "यू तिरोत सिंग: पहाड़ों के राजा",
        "tagline_en": "From the high green Khasi hills, a chief said NO to the British.",
        "tagline_hi": "ऊँची हरी खासी पहाड़ियों से एक मुखिया ने अंग्रेज़ों को 'नहीं' कहा।",
        "era": "1802 - 1835",
        "color": "#65A30D",
        "story_en": (
            "High up in the misty green Khasi hills of what is now Meghalaya lived U Tirot Sing — the proud chief of the Nongkhlaw kingdom. "
            "He loved his hills, his people, his streams, and the cool mist. He was a kind ruler, respected by all the tribal villages around. "
            "Then the British came. They asked Tirot Sing for permission to build a road through his hills to connect Assam with Bengal. "
            "Tirot Sing thought about it carefully and agreed — believing the road would help trade. But then he discovered the British were also bringing soldiers, weapons, and plans to TAKE OVER the Khasi hills! "
            "When he understood the betrayal, Tirot Sing was burning with anger. He ordered the British to leave his hills immediately. They refused. "
            "So in 1829, Tirot Sing raised his army of Khasi warriors and attacked the British camp. He killed two British officers and chased their soldiers down the hills. "
            "For four long years, Tirot Sing fought a brave war against the much bigger British army using guerrilla tactics among the rocks and forests. "
            "His warriors used only swords and bows against guns and cannons — and still won many battles. "
            "Eventually, the British surrounded him with overwhelming force. Wounded and betrayed, Tirot Sing was captured and taken to Dhaka, far from his beloved hills. "
            "He died in British custody on 17th July 1835, never having seen his green Khasi hills again. "
            "Today Meghalaya celebrates 'U Tirot Sing Day' every July 17th — remembering the chief who proved that tribal pride is stronger than any colonial power."
        ),
        "story_hi": (
            "आज के मेघालय की धुंधली हरी खासी पहाड़ियों में यू तिरोत सिंग रहते थे — नोंगख्लाव राज्य के गर्वीले मुखिया। "
            "उन्हें अपनी पहाड़ियाँ, लोग, नदियाँ और ठंडी धुंध बहुत प्यारी थीं। वे दयालु शासक थे जिन्हें सभी आदिवासी गाँव सम्मान देते थे। "
            "फिर अंग्रेज़ आए। उन्होंने असम-बंगाल जोड़ने वाली सड़क बनाने की अनुमति माँगी। "
            "तिरोत सिंग ने सोच-समझकर हाँ कह दी — कि व्यापार में मदद मिलेगी। पर बाद में पता चला कि अंग्रेज़ सैनिक और हथियार लेकर पूरा राज्य हड़पना चाहते हैं! "
            "धोखा समझकर तिरोत सिंग क्रोध से भर गए। उन्होंने अंग्रेज़ों को फ़ौरन निकलने का आदेश दिया। उन्होंने मना कर दिया। "
            "1829 में उन्होंने खासी योद्धाओं की सेना बनाई और अंग्रेज़ी छावनी पर हमला किया। दो अंग्रेज़ अफ़सर मारे गए। "
            "4 साल तक उन्होंने छापामार युद्ध से बहुत बड़ी अंग्रेज़ी सेना से लड़ाई लड़ी। "
            "उनके योद्धाओं के पास केवल तलवार-धनुष थे, अंग्रेज़ों के पास बंदूक-तोप — फिर भी कई लड़ाइयाँ जीतीं। "
            "अंत में अंग्रेज़ों ने भारी सेना से घेर लिया। घायल और धोखा खाए तिरोत सिंग पकड़े गए और ढाका ले जाए गए। "
            "17 जुलाई 1835 को अंग्रेज़ी हिरासत में उनकी मृत्यु हुई। हर साल इस दिन मेघालय 'यू तिरोत सिंग दिवस' मनाता है।"
        ),
        "lessons_en": [
            "Read the small print — trust but verify.",
            "Tribal kings were among the very first to resist colonialism.",
            "Hills and forests are great friends of brave warriors.",
            "Even small armies with bows can defeat big armies with guns.",
        ],
        "lessons_hi": [
            "विश्वास करो पर जाँच भी करो।",
            "आदिवासी राजा सबसे पहले अंग्रेज़ों से लड़े।",
            "पहाड़ और जंगल बहादुरों के दोस्त हैं।",
            "छोटी सेना बड़ी सेना को भी हरा सकती है।",
        ],
        "quiz": [
            {"q_en": "From which hills was Tirot Sing?", "q_hi": "तिरोत सिंग किन पहाड़ियों से थे?",
             "options_en": ["Khasi (Meghalaya)", "Nilgiri", "Aravalli", "Sahyadri"],
             "options_hi": ["खासी (मेघालय)", "नीलगिरि", "अरावली", "सह्याद्रि"], "answer": 0},
            {"q_en": "Why did he start the war?", "q_hi": "उन्होंने युद्ध क्यों शुरू किया?",
             "options_en": ["For gold", "British betrayed him over road plan", "Personal feud", "Got bored"],
             "options_hi": ["सोने के लिए", "अंग्रेज़ों ने सड़क पर धोखा दिया", "निजी झगड़ा", "बोर हो गए"], "answer": 1},
            {"q_en": "For how many years did he fight?", "q_hi": "कितने साल लड़े?",
             "options_en": ["1", "4", "10", "20"], "options_hi": ["1", "4", "10", "20"], "answer": 1},
            {"q_en": "Where did he die?", "q_hi": "उनकी मृत्यु कहाँ हुई?",
             "options_en": ["His hills", "Dhaka prison", "Kolkata", "London"],
             "options_hi": ["अपनी पहाड़ियों", "ढाका जेल", "कोलकाता", "लंदन"], "answer": 1},
            {"q_en": "When is U Tirot Sing Day?", "q_hi": "यू तिरोत सिंग दिवस कब?",
             "options_en": ["15 August", "17 July", "26 January", "2 October"],
             "options_hi": ["15 अगस्त", "17 जुलाई", "26 जनवरी", "2 अक्टूबर"], "answer": 1},
        ],
    },

    # ============================================================
    # 16. Rani Gaidinliu — Manipur/Nagaland — Naga leader
    # ============================================================
    {
        "id": "rani-gaidinliu",
        "name": "Rani Gaidinliu",
        "title_en": "Rani Gaidinliu: The Teenage Queen of the Hills",
        "title_hi": "रानी गैदिनल्यू: पहाड़ों की किशोर रानी",
        "tagline_en": "She led her people at thirteen, was jailed at sixteen, and never lost her spirit.",
        "tagline_hi": "13 साल की उम्र में नेतृत्व किया, 16 में जेल गईं — पर हिम्मत कभी नहीं हारीं।",
        "era": "1915 - 1993",
        "color": "#9333EA",
        "story_en": (
            "In a small Naga village in the high hills of Manipur, a girl named Gaidinliu was born — bright-eyed, quick to learn, and braver than most boys in her village. "
            "From very young, she watched her people suffer under British rule. Heavy taxes, cruel laws, and disrespect for tribal traditions broke her heart. "
            "At just THIRTEEN years old, Gaidinliu joined her cousin Haipou Jadonang's movement to free the Naga people and revive their ancient culture. "
            "When Jadonang was hanged by the British, young Gaidinliu — still a teenager — took charge of the entire movement! "
            "She traveled village to village, asking her people to refuse British taxes and stand together. Her bright eyes and bold speeches gave courage to thousands. "
            "She would shout from the hilltops, 'Naga, awake! Naga, be free!' At only 16 years old, the British finally captured her after a brave guerrilla resistance. "
            "They sentenced her to LIFE imprisonment — but young Gaidinliu's spirit was unbreakable. She spent FOURTEEN long years in different British jails, "
            "moving from one cold cell to another, but never once asking for mercy or breaking down. "
            "When Mahatma Gandhi heard about her, he was so moved that he called her 'Rani' — the Queen — and that name stayed with her forever. "
            "After India's independence, Pandit Nehru finally set her free. She lived to be 78, working her whole life to protect Naga culture, tribal traditions, and India's beautiful northeast. "
            "Today Rani Gaidinliu is remembered as the 'Daughter of the Hills' — proof that even a young teenage girl can become a queen for her people."
        ),
        "story_hi": (
            "मणिपुर की ऊँची पहाड़ियों के एक छोटे नागा गाँव में गैदिनल्यू नाम की एक लड़की जन्मीं — चमकती आँखें, तेज़ बुद्धि, और गाँव के लड़कों से भी बहादुर। "
            "छोटी उम्र से उन्होंने अपने लोगों को अंग्रेज़ी राज में पिसते देखा। भारी कर, क्रूर क़ानून, और आदिवासी संस्कृति का अपमान — सब उनके दिल को दुखाते थे। "
            "केवल 13 साल की उम्र में गैदिनल्यू अपने भाई हैपौ जादोनांग के आंदोलन में शामिल हुईं। "
            "जब अंग्रेज़ों ने जादोनांग को फाँसी दी, युवा गैदिनल्यू — अभी भी किशोरी — ने पूरे आंदोलन की कमान सँभाली! "
            "वे गाँव-गाँव जाकर लोगों से अंग्रेज़ी कर देने से मना करने को कहती थीं। उनकी चमकती आँखें और जोशीले भाषण हज़ारों को प्रेरित करते थे। "
            "वे पहाड़ियों से चिल्लातीं, 'नागा, जागो! नागा, आज़ाद हो!' केवल 16 साल की उम्र में बहादुर छापामार युद्ध के बाद अंग्रेज़ों ने उन्हें पकड़ लिया। "
            "उन्हें आजीवन कारावास की सज़ा हुई — पर उनकी हिम्मत नहीं टूटी। 14 साल उन्होंने अलग-अलग अंग्रेज़ी जेलों में बिताए, "
            "कभी माफ़ी नहीं माँगी। "
            "जब गांधी जी ने उनकी कहानी सुनी, उन्हें 'रानी' की उपाधि दी। "
            "स्वतंत्रता के बाद पंडित नेहरू ने उन्हें छुड़ाया। उन्होंने 78 साल जीवन भर नागा संस्कृति की रक्षा की।"
        ),
        "lessons_en": [
            "Even teenagers can become leaders of their people.",
            "Honor your culture and your ancestors.",
            "Long years in jail cannot break a brave spirit.",
            "Daughters of India have ruled mountains too.",
        ],
        "lessons_hi": [
            "किशोर भी अपने लोगों के नेता बन सकते हैं।",
            "अपनी संस्कृति और पूर्वजों का सम्मान करो।",
            "लंबी जेल भी बहादुर हिम्मत को नहीं तोड़ सकती।",
            "भारत की बेटियों ने पहाड़ भी संभाले हैं।",
        ],
        "quiz": [
            {"q_en": "At what age did Gaidinliu join the movement?", "q_hi": "किस उम्र में आंदोलन में आईं?",
             "options_en": ["10", "13", "20", "30"], "options_hi": ["10", "13", "20", "30"], "answer": 1},
            {"q_en": "From which hills was she?", "q_hi": "वे किन पहाड़ियों से थीं?",
             "options_en": ["Khasi", "Naga (Manipur/Nagaland)", "Aravalli", "Vindhya"],
             "options_hi": ["खासी", "नागा (मणिपुर/नागालैंड)", "अरावली", "विंध्य"], "answer": 1},
            {"q_en": "Who gave her the title 'Rani'?", "q_hi": "'रानी' की उपाधि किसने दी?",
             "options_en": ["British", "Nehru", "Mahatma Gandhi", "Her father"],
             "options_hi": ["अंग्रेज़", "नेहरू", "महात्मा गांधी", "उनके पिता"], "answer": 2},
            {"q_en": "How many years did she spend in prison?", "q_hi": "जेल में कितने साल बिताए?",
             "options_en": ["1", "5", "14", "30"], "options_hi": ["1", "5", "14", "30"], "answer": 2},
            {"q_en": "Who set her free after independence?", "q_hi": "स्वतंत्रता के बाद किसने छुड़ाया?",
             "options_en": ["Gandhi", "Nehru", "Patel", "Bose"],
             "options_hi": ["गांधी", "नेहरू", "पटेल", "बोस"], "answer": 1},
        ],
    },
]
