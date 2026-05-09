"""Seed data for freedom fighter stories with extended English + Hindi versions, lessons, and quizzes."""

# Will be extended at the end of the file with regional heroes (north/east/west/south/tribal).

STORIES = [
    {
        "id": "bhagat-singh",
        "name": "Bhagat Singh",
        "title_en": "Bhagat Singh: The Roar of a Young Lion",
        "title_hi": "भगत सिंह: एक नौजवान शेर की दहाड़",
        "tagline_en": "Inquilab Zindabad! The young revolutionary who ignited a generation.",
        "tagline_hi": "इंक़लाब ज़िंदाबाद! वह नौजवान क्रांतिकारी जिसने एक पीढ़ी को जगाया।",
        "era": "1907 - 1931",
        "color": "#D72638",
        "story_en": (
            "In a small village called Banga in Punjab, a curious boy named Bhagat Singh once knelt in his family's garden, pressing tiny seeds into the soft earth. His uncle saw him and laughed, 'What are you growing, beta?' Bhagat smiled with bright eyes and said, 'I am growing guns to free our country!' Even as a five-year-old, his heart already burned for a free India. "
            "Bhagat grew up hearing stories of brave warriors and seeing the pain of his people under British rule. When he was just twelve, the terrible Jallianwala Bagh massacre happened in Amritsar, where hundreds of innocent Indians were killed while peacefully gathering. Young Bhagat walked all the way to the bloody ground, filled a small bottle with the soil, and kept it on his study table forever — a daily reminder of his promise to fight injustice. "
            "As a teenager, Bhagat read books from every corner of the world — about brave revolutionaries, kind philosophers, and clever scientists. He believed knowledge was a sword sharper than any blade. He spoke many languages and wrote beautiful essays. He dreamed of an India where rich and poor, every caste, every faith, would walk together with dignity. "
            "When the British passed cruel laws and one of his heroes, Lala Lajpat Rai, died after being beaten by police, Bhagat decided he must act. With his close friends Sukhdev and Rajguru, he planned a daring protest. On 8th April 1929, Bhagat Singh and Batukeshwar Dutt walked into the Central Legislative Assembly in Delhi. They threw two harmless smoke bombs into an empty corner — not to hurt anyone, but to make the world listen. Then they raised their fists and shouted, 'Inquilab Zindabad! Long Live the Revolution!' "
            "Bhagat could have run away. But he stayed, because being captured meant he could speak in court — and through him, the whole world would hear India's pain. In jail, he was treated cruelly. So he led a 116-day hunger strike to demand fair treatment for Indian prisoners. Even hungry and weak, he read books every day, wrote inspiring letters, and made his fellow prisoners laugh. "
            "On 23rd March 1931, at just 23 years old, Bhagat Singh walked to the gallows with a smile on his face. People say he hugged the rope and shouted his slogans one last time. His final words inspired millions. India would not be free for sixteen more years, but every freedom fighter after him drew courage from his name. "
            "Today, his picture in a yellow turban with a moustache is one of India's most loved images — the boy who proved that one brave young heart can light a fire that no empire can put out."
        ),
        "story_hi": (
            "पंजाब के बंगा गाँव में एक छोटा-सा जिज्ञासु बच्चा था — भगत सिंह। एक दिन उसने बगीचे में नन्हे-नन्हे बीज मिट्टी में दबाए। चाचा ने हँसकर पूछा, 'बेटा, क्या उगा रहे हो?' भगत की चमकती आँखों से जवाब आया, 'चाचा जी, मैं देश को आज़ाद कराने के लिए बंदूकें उगा रहा हूँ!' पाँच साल की उम्र में भी उसका दिल आज़ाद भारत के लिए धड़कता था। "
            "भगत वीरों की कहानियाँ सुनकर बड़ा हुआ और अपने लोगों का दर्द अंग्रेज़ी राज में देखता रहा। जब वह सिर्फ़ बारह साल का था, अमृतसर में जलियाँवाला बाग़ का भयानक नरसंहार हुआ — सैकड़ों निर्दोष भारतीय एक शांतिपूर्ण सभा में मारे गए। नन्हा भगत वहाँ पैदल पहुँचा, खून से लथपथ मिट्टी एक छोटी शीशी में भरकर अपनी पढ़ाई की मेज़ पर हमेशा रखने लगा — अन्याय के विरुद्ध लड़ने का रोज़ाना का वादा। "
            "किशोर होकर भगत ने दुनिया भर की किताबें पढ़ीं — वीर क्रांतिकारियों की, दयालु दार्शनिकों की, होशियार वैज्ञानिकों की। वह मानता था कि ज्ञान किसी भी तलवार से तेज़ हथियार है। उसने कई भाषाएँ सीखीं और सुंदर लेख लिखे। वह ऐसे भारत का सपना देखता था जहाँ अमीर-ग़रीब, हर जाति, हर धर्म साथ-साथ सम्मान से चलें। "
            "जब अंग्रेज़ों ने क्रूर क़ानून बनाए और उसके आदर्श लाला लाजपत राय पुलिस की लाठियों से शहीद हो गए, तो भगत ने ठान लिया कि अब चुप नहीं रहेगा। दोस्तों सुखदेव और राजगुरु के साथ उसने एक साहसी विरोध की योजना बनाई। 8 अप्रैल 1929 को भगत सिंह और बटुकेश्वर दत्त दिल्ली की केंद्रीय असेंबली में पहुँचे। उन्होंने एक खाली कोने में दो बेज़रर धुएँ वाले बम फेंके — किसी को मारने के लिए नहीं, बल्कि दुनिया को सुनाने के लिए। फिर मुट्ठी उठाकर गरजे — 'इंक़लाब ज़िंदाबाद! क्रांति अमर रहे!' "
            "भगत भाग सकते थे, पर वहीं रुक गए, क्योंकि गिरफ़्तारी का मतलब था अदालत में बोलने का मौका — और उनके ज़रिए पूरी दुनिया भारत का दर्द सुनेगी। जेल में उनके साथ बहुत बुरा बर्ताव हुआ। उन्होंने 116 दिन की भूख-हड़ताल की ताकि भारतीय क़ैदियों को न्याय मिले। भूखे और कमज़ोर होकर भी वे रोज़ किताबें पढ़ते, प्रेरणादायक चिट्ठियाँ लिखते, और अपने साथियों को हँसाते। "
            "23 मार्च 1931 को, मात्र 23 साल की उम्र में, भगत सिंह मुस्कुराते हुए फाँसी के तख़्त पर चढ़ गए। कहते हैं उन्होंने रस्सी को गले लगाकर आख़िरी बार अपना नारा गरजा। उनके आख़िरी शब्दों ने करोड़ों को प्रेरित किया। भारत को आज़ाद होने में अभी सोलह साल बाक़ी थे, पर हर बाद का स्वतंत्रता सेनानी उनके नाम से हिम्मत लेता रहा। "
            "आज पीली पगड़ी और मूँछों वाली उनकी तस्वीर भारत की सबसे प्यारी छवियों में से एक है — वह नौजवान जिसने साबित किया कि एक बहादुर युवा दिल ऐसी आग जला सकता है जिसे कोई साम्राज्य नहीं बुझा सकता।"
        ),
        "lessons_en": [
            "Books are your sharpest sword — read every day, even just one page, to fill your mind with new ideas like Bhagat Singh did.",
            "Stand up for someone being bullied. If a friend is teased at school, speak up kindly — that's your own little Inquilab.",
            "Stay calm under pressure. When something feels unfair, breathe, think, then act — don't run away from a tough conversation.",
            "Age is just a number. You don't have to wait until you're grown up to do brave, kind, important things — start today.",
        ],
        "lessons_hi": [
            "किताबें तुम्हारी सबसे तेज़ तलवार हैं — रोज़ कम से कम एक पन्ना ज़रूर पढ़ो, जैसे भगत सिंह ने अपने मन को नए विचारों से भरा।",
            "अगर किसी को परेशान किया जा रहा हो तो उसके लिए खड़े हो जाओ। स्कूल में दोस्त चिढ़ाया जा रहा हो तो प्यार से बोलो — यही तुम्हारा छोटा इंक़लाब है।",
            "मुश्किल में शांत रहो। जब कुछ अन्यायपूर्ण लगे, तो साँस लो, सोचो, फिर बोलो — कठिन बातचीत से भागो मत।",
            "उम्र सिर्फ़ एक संख्या है। बहादुर, दयालु, और ज़रूरी काम करने के लिए बड़े होने का इंतज़ार मत करो — आज से शुरू करो।",
        ],
        "quiz": [
            {"q_en": "What did young Bhagat Singh plant in his garden?", "q_hi": "नन्हे भगत सिंह ने बगीचे में क्या बोया था?", "options_en": ["Flowers", "Tiny guns", "Mango seeds", "Vegetables"], "options_hi": ["फूल", "छोटी बंदूकें", "आम के बीज", "सब्ज़ियाँ"], "answer": 1},
            {"q_en": "What slogan did Bhagat Singh shout in the assembly?", "q_hi": "असेंबली में भगत सिंह ने कौन सा नारा लगाया?", "options_en": ["Jai Hind", "Vande Mataram", "Inquilab Zindabad", "Bharat Mata Ki Jai"], "options_hi": ["जय हिंद", "वंदे मातरम्", "इंक़लाब ज़िंदाबाद", "भारत माता की जय"], "answer": 2},
            {"q_en": "How old was Bhagat Singh when he gave his life?", "q_hi": "बलिदान के समय भगत सिंह की उम्र कितनी थी?", "options_en": ["16", "20", "23", "30"], "options_hi": ["16", "20", "23", "30"], "answer": 2},
            {"q_en": "How many days did Bhagat Singh's hunger strike last?", "q_hi": "भगत सिंह की भूख-हड़ताल कितने दिन चली?", "options_en": ["10", "50", "116", "200"], "options_hi": ["10", "50", "116", "200"], "answer": 2},
            {"q_en": "Bhagat Singh teaches us that...", "q_hi": "भगत सिंह हमें सिखाते हैं कि...", "options_en": ["Only adults can change the world", "Age is just a number", "Books are not important", "Fear is good"], "options_hi": ["केवल बड़े दुनिया बदल सकते हैं", "उम्र केवल एक संख्या है", "किताबें ज़रूरी नहीं", "डर अच्छा है"], "answer": 1},
        ],
    },
    {
        "id": "rani-lakshmibai",
        "name": "Rani Lakshmibai",
        "title_en": "Rani Lakshmibai: The Warrior Queen of Jhansi",
        "title_hi": "रानी लक्ष्मीबाई: झाँसी की वीर रानी",
        "tagline_en": "Main apni Jhansi nahi doongi! The queen who rode into battle with her child on her back.",
        "tagline_hi": "मैं अपनी झाँसी नहीं दूँगी! वह रानी जो अपने बच्चे को पीठ पर बाँधकर युद्ध में कूद पड़ी।",
        "era": "1828 - 1858",
        "color": "#7B1FA2",
        "story_en": (
            "In the holy city of Varanasi, on a warm November morning in 1828, a baby girl was born and named Manikarnika — but her family lovingly called her 'Manu'. Her mother passed away when Manu was only four, and her father raised her with great love in the court of the Peshwa of Bithoor. There, while other little girls were taught to stay quiet and small, Manu galloped horses, fenced with wooden swords, climbed trees, and read epics of warrior queens. She grew up alongside princes Nana Sahib and Tatya Tope, who would one day fight for India by her side. "
            "When Manu was about thirteen, she was married to the Maharaja of Jhansi and became Rani Lakshmibai — but in her heart she was still the brave Manu. She trained women of her court in horse-riding and sword-fighting, including her dear friends Jhalkari Bai (who looked just like her!) and Mundar. Together, they became the famous Durga Dal — the army of women warriors. "
            "Tragedy came knocking. Her young son passed away as a baby, and soon after, the Maharaja also died. The British East India Company saw their chance. Using a cruel rule called the 'Doctrine of Lapse', they declared that since the Rani had no son of her own, Jhansi now belonged to them — even though she had adopted a wonderful boy named Damodar. "
            "Officers came to her palace. They smiled politely and demanded, 'Hand over Jhansi.' The Rani's eyes flashed like lightning. She rose to her full height and thundered, 'Main apni Jhansi nahi doongi!' — 'I will not give up my Jhansi!' Those six words shook history. "
            "In 1857, the great revolt for independence swept across India. The British army marched on Jhansi with cannons. The Rani prepared the fort for battle. For days, women, men, and children worked together — making bullets, cooking food, repairing walls, even singing songs to keep spirits high. The Rani slept very little and visited every soldier herself. "
            "When the city finally fell, she did not surrender. With baby Damodar tied carefully to her back in a soft cloth, she leapt onto her white horse Badal and jumped from the high fort wall to safety. Her kind friend Jhalkari Bai bravely pretended to be the queen to give her time to escape. "
            "The Rani rode through the night to Kalpi, then to Gwalior, gathering soldiers and refusing to give up. On 18th June 1858, dressed as a soldier, she fought her last battle near Gwalior. Even British generals later wrote that she was 'the bravest and best leader of the rebels.' "
            "She gave her life protecting her people and her land. But her courage became immortal. Today, every Indian child grows up hearing the famous song, 'Khoob ladi mardani, woh toh Jhansi waali Rani thi' — 'She fought like a man, she was the Queen of Jhansi.' Her story still rides on, reminding girls everywhere that they can be brave, brilliant, and unstoppable."
        ),
        "story_hi": (
            "पवित्र काशी (वाराणसी) में नवंबर 1828 की एक गर्म सुबह एक बच्ची का जन्म हुआ और नाम रखा गया — मणिकर्णिका। पर परिवार उसे प्यार से 'मनु' कहता था। चार साल की उम्र में ही उसकी माँ चल बसी, और पिता ने उसे बिठूर के पेशवा के दरबार में बहुत प्यार से पाला। जहाँ बाकी लड़कियों को चुप रहना सिखाया जाता था, वहाँ मनु घोड़े दौड़ाती, लकड़ी की तलवार से तलवारबाज़ी करती, पेड़ों पर चढ़ती, और वीरांगनाओं के महाकाव्य पढ़ती। वह नाना साहब और तात्या टोपे के साथ पली-बढ़ी, जो आगे चलकर उसके साथ भारत के लिए लड़ने वाले थे। "
            "लगभग तेरह साल की उम्र में मनु का विवाह झाँसी के महाराजा से हुआ और वह रानी लक्ष्मीबाई कहलाईं — पर दिल में अब भी वही बहादुर मनु थीं। उन्होंने दरबार की महिलाओं को घुड़सवारी और तलवारबाज़ी सिखाई, जिनमें उनकी बहुत प्यारी सहेलियाँ झलकारी बाई (जो उनकी ही शक्ल की थीं!) और मुंदर थीं। साथ मिलकर उन्होंने प्रसिद्ध 'दुर्गा दल' बनाई — महिला योद्धाओं की सेना। "
            "फिर दुख आया। उनका नन्हा बेटा शिशु अवस्था में चल बसा, और कुछ ही समय बाद महाराजा भी। ब्रिटिश ईस्ट इंडिया कंपनी ने मौक़ा देखा। 'डॉक्ट्रिन ऑफ़ लैप्स' नाम के क्रूर क़ानून के तहत उन्होंने ऐलान कर दिया कि चूँकि रानी का अपना बेटा नहीं है, झाँसी अब उनकी है — जबकि रानी ने दामोदर नाम के एक प्यारे बच्चे को गोद ले लिया था। "
            "अंग्रेज़ अधिकारी महल आए। मीठे मुस्कान से बोले, 'झाँसी हमें सौंप दो।' रानी की आँखें बिजली की तरह चमकीं। वे पूरी ऊँचाई पर खड़ी हुईं और गरजीं — 'मैं अपनी झाँसी नहीं दूँगी!' इन छह शब्दों ने इतिहास हिला दिया। "
            "1857 में पूरे भारत में स्वतंत्रता का महान विद्रोह भड़का। अंग्रेज़ी सेना तोपों के साथ झाँसी पर चढ़ आई। रानी ने क़िले को युद्ध के लिए तैयार किया। कई दिन तक स्त्री, पुरुष, बच्चे — सब साथ काम करते रहे — गोलियाँ बनाते, खाना पकाते, दीवारें मरम्मत करते, और हौसले के लिए गीत गाते। रानी कम सोतीं और हर सैनिक से ख़ुद मिलने जातीं। "
            "जब आख़िरकार शहर गिरा, उन्होंने आत्मसमर्पण नहीं किया। नन्हे दामोदर को नरम कपड़े में पीठ से बाँधकर, वे अपनी सफ़ेद घोड़ी 'बादल' पर सवार हुईं और ऊँची क़िले की दीवार से छलाँग लगा दीं। उनकी सहेली झलकारी बाई ने रानी का भेस धरकर उन्हें बचने का समय दिया। "
            "रानी पूरी रात घोड़ा दौड़ाते हुए कालपी, फिर ग्वालियर पहुँचीं, सैनिक जुटाती रहीं। 18 जून 1858 को सैनिक की पोशाक में उन्होंने ग्वालियर के पास अपनी आख़िरी लड़ाई लड़ी। बाद में अंग्रेज़ जनरलों ने भी लिखा कि वे 'विद्रोहियों की सबसे बहादुर और सबसे योग्य नेता' थीं। "
            "अपने लोगों और अपनी ज़मीन की रक्षा में उन्होंने प्राण न्योछावर कर दिए। पर उनका साहस अमर हो गया। आज हर भारतीय बच्चा यह गीत सुनकर बड़ा होता है — 'ख़ूब लड़ी मर्दानी, वो तो झाँसी वाली रानी थी।' उनकी कहानी अब भी दौड़ रही है, हर लड़की को बता रही है कि वह बहादुर, होशियार और अजेय हो सकती है।"
        ),
        "lessons_en": [
            "Try things people say 'aren't for you'. If someone says girls can't play cricket or boys can't dance, do it gracefully — like Manu rode horses when girls weren't supposed to.",
            "Defend what you love. Whether it's a younger sibling, a pet, or your idea — stand firm and say, 'I will not give this up,' kindly but clearly.",
            "Carry your responsibilities with courage. Even if school feels heavy, like the Rani carried Damodar into battle, you can carry your duties with love and bravery.",
            "Friends make you stronger. Build your own Durga Dal — a circle of friends who lift each other up and learn new skills together.",
        ],
        "lessons_hi": [
            "वो काम करो जो लोग कहते हैं 'तुम्हारे लिए नहीं'। अगर कहा जाए कि लड़कियाँ क्रिकेट नहीं खेल सकतीं या लड़के नाच नहीं सकते — तो शान से करो, जैसे मनु ने उस ज़माने में घुड़सवारी की।",
            "जिसे प्यार करो उसकी रक्षा करो। चाहे छोटा भाई-बहन हो, पालतू जानवर हो, या तुम्हारा कोई विचार — डटकर कहो 'मैं इसे नहीं छोड़ूँगा/छोड़ूँगी,' पर प्यार से।",
            "अपनी ज़िम्मेदारियाँ हिम्मत से उठाओ। पढ़ाई भारी लगे तब भी, जैसे रानी ने दामोदर को पीठ पर बाँधकर युद्ध लड़ा, तुम भी अपने कर्तव्य प्यार और बहादुरी से निभा सकते हो।",
            "दोस्त तुम्हें मज़बूत बनाते हैं। अपनी 'दुर्गा दल' बनाओ — ऐसे दोस्तों का घेरा जो एक-दूसरे को आगे बढ़ाएँ और साथ नए हुनर सीखें।",
        ],
        "quiz": [
            {"q_en": "What was Rani Lakshmibai's childhood name?", "q_hi": "रानी लक्ष्मीबाई का बचपन का नाम क्या था?", "options_en": ["Lakshmi", "Manikarnika", "Damodar", "Jhalkari"], "options_hi": ["लक्ष्मी", "मणिकर्णिका", "दामोदर", "झलकारी"], "answer": 1},
            {"q_en": "What was the name of Rani's white horse?", "q_hi": "रानी के सफ़ेद घोड़े का क्या नाम था?", "options_en": ["Chetak", "Badal", "Vayu", "Surya"], "options_hi": ["चेतक", "बादल", "वायु", "सूर्य"], "answer": 1},
            {"q_en": "Which famous words did the Rani say?", "q_hi": "रानी ने कौन से प्रसिद्ध शब्द कहे?", "options_en": ["Jai Jhansi", "I will not give up my Jhansi", "Save India", "Run away"], "options_hi": ["जय झाँसी", "मैं अपनी झाँसी नहीं दूँगी", "भारत बचाओ", "भाग जाओ"], "answer": 1},
            {"q_en": "What was Rani's army of women called?", "q_hi": "रानी की महिला सेना का नाम क्या था?", "options_en": ["Veer Sena", "Durga Dal", "Shakti Sangh", "Rani Bal"], "options_hi": ["वीर सेना", "दुर्गा दल", "शक्ति संघ", "रानी बल"], "answer": 1},
            {"q_en": "Who pretended to be the Rani so she could escape?", "q_hi": "रानी को बचाने के लिए किसने उनका भेस धरा?", "options_en": ["Mundar", "Jhalkari Bai", "Tatya Tope", "Nana Sahib"], "options_hi": ["मुंदर", "झलकारी बाई", "तात्या टोपे", "नाना साहब"], "answer": 1},
        ],
    },
    {
        "id": "mahatma-gandhi",
        "name": "Mahatma Gandhi",
        "title_en": "Mahatma Gandhi: The Salt of Freedom",
        "title_hi": "महात्मा गांधी: आज़ादी का नमक",
        "tagline_en": "He fought the mightiest empire with truth, salt, and a smile.",
        "tagline_hi": "उन्होंने सबसे बड़ी सत्ता को सत्य, नमक और मुस्कान से हराया।",
        "era": "1869 - 1948",
        "color": "#138808",
        "story_en": (
            "In the seaside town of Porbandar in Gujarat, on 2nd October 1869, a baby boy was born named Mohandas Karamchand Gandhi. As a child, Mohan was thin, shy, and afraid of the dark, of ghosts, and of speaking in front of people. But there was one thing he loved more than anything else — the truth. "
            "Once, as a young boy, Mohan ate a small piece of meat (something his religious family did not eat) just to see if it would make him strong like the British boys. He felt so guilty that for days he could not look at his parents. Finally, with his hands trembling, he wrote a letter to his father confessing everything. He expected to be scolded loudly. Instead, his father read the letter and tears rolled down his cheeks. He hugged Mohan and forgave him with love. That day, young Mohan learned the magical power of telling the truth, even when it is hard. "
            "Mohan grew up and travelled to England to become a lawyer. Later, he sailed to South Africa for work. There, on a cold night, he was thrown off a train at Pietermaritzburg station — only because he was Indian and refused to leave the first-class compartment for which he had a valid ticket. Sitting shivering on that lonely platform, Mohan made a decision that would change history: he would peacefully fight unfair treatment, anywhere and everywhere. "
            "He returned to India and saw how the British made poor farmers grow indigo, how factory workers were treated cruelly, and how Indians were not allowed in many places in their own country. Mohan, now lovingly called Bapu (father), taught India two magical ideas: 'Ahimsa' — never hurt anyone, even your enemy — and 'Satyagraha' — hold on to truth like a lion holds its prey. "
            "When the British made it illegal for Indians to make their own salt from the sea (a basic, free thing!), Bapu did something amazing. On 12th March 1930, he started walking from Sabarmati Ashram with 78 followers. They walked under the burning sun for 24 days and 240 miles. Thousands joined along the way. On 6th April, Bapu reached Dandi beach, knelt down, and picked up a fistful of salty earth. He held it up and said, 'With this salt, I am shaking the foundations of an Empire.' The whole world watched in wonder. "
            "Bapu spun his own clothes on a small wheel called a charkha. He wore simple white khadi. He cleaned toilets himself to teach that no work is small. He prayed with people of every religion. He went to jail many times — and from jail he wrote letters of forgiveness even to those who hurt him. "
            "On 15th August 1947, after decades of struggle, India became free. Bapu was sad about the violence between communities and walked from village to village teaching peace. On 30th January 1948, he was shot while going to evening prayer. His last words were 'Hey Ram'. "
            "Today, Bapu's gentle smile lives on every Indian rupee note, and his lesson lives on in every act of kindness. He is loved across the world as proof that the softest voice, when truthful, can be stronger than the loudest sword."
        ),
        "story_hi": (
            "गुजरात के समुद्री शहर पोरबंदर में 2 अक्टूबर 1869 को एक बच्चे का जन्म हुआ — मोहनदास करमचंद गांधी। बचपन में मोहन दुबला, शर्मीला और अंधेरे, भूतों और लोगों के सामने बोलने से डरने वाला था। पर एक चीज़ सबसे ज़्यादा प्यारी थी — सच्चाई। "
            "एक बार छोटे मोहन ने मांस का एक टुकड़ा चख लिया (जो उसके धार्मिक परिवार में नहीं खाया जाता था) — सिर्फ़ यह देखने के लिए कि क्या वह अंग्रेज़ बच्चों जितना ताक़तवर बन जाएगा। वह कई दिन तक माता-पिता से नज़र नहीं मिला सके। अंत में काँपते हाथों से पिता को एक चिट्ठी लिखकर सब कुछ कबूल कर दिया। वे डाँट की उम्मीद कर रहे थे, पर पिता ने चिट्ठी पढ़ी और आँखों से आँसू बहने लगे। उन्होंने मोहन को गले लगाया और प्यार से माफ़ कर दिया। उस दिन नन्हे मोहन को सच बोलने की जादुई शक्ति समझ में आई — चाहे यह कितना भी मुश्किल क्यों न हो। "
            "बड़े होकर मोहन वकालत पढ़ने इंग्लैंड गए। बाद में काम के लिए दक्षिण अफ़्रीका। वहाँ एक ठंडी रात उन्हें पीटरमैरिट्ज़बर्ग स्टेशन पर ट्रेन से उतार दिया गया — सिर्फ़ इसलिए कि वे भारतीय थे, हालाँकि उनके पास सही फ़र्स्ट क्लास का टिकट था। उस सुनसान प्लेटफ़ॉर्म पर ठिठुरते हुए मोहन ने वह फ़ैसला लिया जिसने इतिहास बदल दिया — वे अन्याय से शांति से लड़ेंगे, हर जगह। "
            "भारत लौटकर उन्होंने देखा कि अंग्रेज़ ग़रीब किसानों से ज़बरन नील उगवाते हैं, मज़दूरों से अमानवीय व्यवहार करते हैं, और भारतीयों को अपने ही देश में कई जगह नहीं जाने देते। अब वे प्यार से 'बापू' कहलाने लगे। उन्होंने भारत को दो जादुई विचार सिखाए — 'अहिंसा', यानी किसी को मत मारो, यहाँ तक कि दुश्मन को भी; और 'सत्याग्रह', यानी सत्य को शेर की पकड़ की तरह थामो। "
            "जब अंग्रेज़ों ने समुद्र से नमक बनाना ग़ैरक़ानूनी कर दिया (जो मुफ़्त की चीज़ थी!), तो बापू ने कमाल कर दिया। 12 मार्च 1930 को साबरमती आश्रम से 78 साथियों के साथ पैदल चले। 24 दिन तक भीषण धूप में 240 मील चले। हज़ारों लोग रास्ते में जुड़ते गए। 6 अप्रैल को बापू दांडी समुद्र तट पर पहुँचे, झुककर मुट्ठी भर नमकीन मिट्टी उठाई और बोले, 'इस नमक से मैं साम्राज्य की नींव हिला रहा हूँ।' सारी दुनिया अचंभित होकर देखती रही। "
            "बापू चरखे पर अपने कपड़े ख़ुद कातते। सादी सफ़ेद खादी पहनते। शौचालय ख़ुद साफ़ करते — यह सिखाने के लिए कि कोई काम छोटा नहीं। हर धर्म के लोगों के साथ प्रार्थना करते। कई बार जेल गए — जेल से उन लोगों को भी माफ़ी की चिट्ठियाँ लिखते जो उन्हें सताते थे। "
            "15 अगस्त 1947 को दशकों के संघर्ष के बाद भारत आज़ाद हुआ। बापू समुदायों के बीच हिंसा से बहुत दुखी थे और गाँव-गाँव जाकर शांति का संदेश देते रहे। 30 जनवरी 1948 को शाम की प्रार्थना के लिए जाते हुए उन्हें गोली मार दी गई। आख़िरी शब्द थे — 'हे राम'। "
            "आज बापू की कोमल मुस्कान हर भारतीय नोट पर रहती है, और उनकी सीख हर दया भरे काम में जीवित है। पूरी दुनिया उन्हें इस बात का प्रमाण मानती है कि सबसे कोमल आवाज़, जब सच्ची हो, सबसे तेज़ तलवार से ज़्यादा मज़बूत हो सकती है।"
        ),
        "lessons_en": [
            "Tell the truth, even when it's scary. Broke a vase? Got a low mark? Tell your parents — they'll respect you more, just like Bapu's father did.",
            "Solve fights without hitting. If a sibling annoys you, take a deep breath, talk it out, walk away — that's Ahimsa in action.",
            "No work is small. Help clean the dining table, wash your own plate, or pick up litter at school — Bapu cleaned toilets to show every job is honourable.",
            "Live simply. You don't need 50 toys to be happy. Pick a favourite, share the rest — Bapu owned almost nothing and was full of joy.",
        ],
        "lessons_hi": [
            "सच बोलो, चाहे डर लगे। फूलदान टूट गया? कम नंबर आए? माता-पिता को बता दो — वे और सम्मान करेंगे, जैसे बापू के पिता ने किया।",
            "लड़ाई बिना मारे सुलझाओ। भाई-बहन तंग करे तो गहरी साँस लो, बात करो, हट जाओ — यही अहिंसा का असली रूप है।",
            "कोई काम छोटा नहीं। डाइनिंग टेबल साफ़ करने में मदद करो, अपनी थाली ख़ुद धोओ, स्कूल में कूड़ा उठाओ — बापू ने शौचालय साफ़ करके सिखाया कि हर काम सम्मानित है।",
            "साधारण जीवन जिओ। ख़ुश रहने के लिए 50 खिलौनों की ज़रूरत नहीं। एक पसंदीदा रखो, बाकी बाँट दो — बापू के पास कुछ नहीं था पर वे आनंद से भरे थे।",
        ],
        "quiz": [
            {"q_en": "What did people lovingly call Gandhi?", "q_hi": "लोग गांधी जी को प्यार से क्या कहते थे?", "options_en": ["Babu", "Bapu", "Beta", "Bhau"], "options_hi": ["बाबू", "बापू", "बेटा", "भाऊ"], "answer": 1},
            {"q_en": "What does 'Ahimsa' mean?", "q_hi": "'अहिंसा' का क्या अर्थ है?", "options_en": ["War", "Non-violence", "Truth", "Fasting"], "options_hi": ["युद्ध", "अहिंसा / बिना मारे", "सत्य", "उपवास"], "answer": 1},
            {"q_en": "How far did Gandhi walk for the Salt March?", "q_hi": "गांधी जी ने नमक यात्रा में कितनी दूरी तय की?", "options_en": ["10 miles", "100 miles", "240 miles", "500 miles"], "options_hi": ["10 मील", "100 मील", "240 मील", "500 मील"], "answer": 2},
            {"q_en": "At which station was Gandhi thrown off the train?", "q_hi": "किस स्टेशन पर गांधी को ट्रेन से उतार दिया गया?", "options_en": ["Mumbai Central", "Pietermaritzburg", "London Paddington", "Karachi"], "options_hi": ["मुंबई सेंट्रल", "पीटरमैरिट्ज़बर्ग", "लंदन पैडिंगटन", "कराची"], "answer": 1},
            {"q_en": "In which year did India become free?", "q_hi": "भारत किस वर्ष आज़ाद हुआ?", "options_en": ["1942", "1947", "1950", "1857"], "options_hi": ["1942", "1947", "1950", "1857"], "answer": 1},
        ],
    },
    {
        "id": "subhas-bose",
        "name": "Subhas Chandra Bose",
        "title_en": "Netaji Subhas Chandra Bose: Give Me Blood, I'll Give You Freedom",
        "title_hi": "नेताजी सुभाष चंद्र बोस: तुम मुझे ख़ून दो, मैं तुम्हें आज़ादी दूँगा",
        "tagline_en": "The fearless leader who built an army across oceans for India.",
        "tagline_hi": "वह निर्भीक नेता जिन्होंने सात समंदर पार भारत के लिए सेना बनाई।",
        "era": "1897 - 1945",
        "color": "#1A365D",
        "story_en": (
            "In the bustling town of Cuttack in Odisha, on 23rd January 1897, a baby boy was born into a large, loving family. He was the ninth child and his parents named him Subhas. From a young age, Subhas was unusually serious. While other boys played, he sat under trees with thick books — about brave warriors, kind saints, and clever scientists. He loved Swami Vivekananda's teachings most of all and dreamed of doing something great for India. "
            "Subhas was a brilliant student. He won prize after prize. His parents wanted him to take the toughest exam in the British Empire — the Indian Civil Service exam in England — and become a high-ranking officer. So he sailed to England, studied hard, and ranked fourth in the entire empire! His family was overjoyed. "
            "But Subhas had a problem his family did not yet know. He could not bear the idea of working FOR the British, who were hurting his motherland. Sitting in a quiet English park, he made the bravest decision of his life — he resigned from the most prestigious job in India before he even started it. He wrote home, 'I cannot serve those who oppress my people.' "
            "Returning to India, Subhas joined the freedom movement. He became so loved that people began calling him 'Netaji' — the Respected Leader. He worked closely with Mahatma Gandhi, but felt that India needed bolder, faster action. While Bapu walked the path of complete non-violence, Netaji believed an oppressed nation could also use brave force when peaceful pleas were ignored. "
            "When World War II broke out, Netaji saw a golden chance. The British were busy fighting Germany and Japan. But he was placed under house arrest in Calcutta. So one cold January night in 1941, dressed as a Pathan elder named 'Ziauddin', he secretly escaped — by car to Gomoh, by train across India, and through Afghan mountains all the way to Berlin! There he asked Hitler to help free India, but soon felt Germany was too far from home. "
            "He then took an even more daring journey — by submarine through dangerous oceans — to Japan, and finally to Singapore. There, in front of thousands of Indian soldiers and workers living in Southeast Asia, Netaji stood tall and roared, 'Tum mujhe khoon do, main tumhe azaadi doonga!' — 'Give me your blood, and I will give you freedom!' The crowd thundered back, 'Jai Hind!' "
            "He built the Azad Hind Fauj — the Indian National Army — with thousands of brave volunteers. He created an all-women regiment named after Rani Lakshmibai, led by Captain Lakshmi Sahgal. They marched towards India, capturing the Andaman Islands and reaching Imphal, shouting 'Chalo Dilli!' — 'On to Delhi!' "
            "On 18th August 1945, Netaji's plane reportedly crashed near Taiwan and he disappeared from history — though many Indians still believe he survived. Whatever the truth, his fire never died. The British later admitted that the INA's bravery and the trials of its officers in Delhi gave them no choice but to leave India. "
            "Netaji proved that bold dreams plus brave action can build armies, cross oceans, and shake the chains of any empire."
        ),
        "story_hi": (
            "उड़ीसा के व्यस्त शहर कटक में 23 जनवरी 1897 को एक बड़े प्यारे परिवार में नौवें बच्चे का जन्म हुआ — सुभाष। बचपन से ही सुभाष असामान्य रूप से गंभीर थे। बाकी बच्चे खेलते, और वे पेड़ों के नीचे बैठकर मोटी किताबें पढ़ते — वीर योद्धाओं, संतों और वैज्ञानिकों की। स्वामी विवेकानंद की शिक्षाओं से सबसे ज़्यादा प्रभावित थे और भारत के लिए कुछ महान करने का सपना देखते थे। "
            "सुभाष ज़बरदस्त छात्र थे। एक के बाद एक पुरस्कार जीतते। माता-पिता चाहते थे कि वे ब्रिटिश साम्राज्य की सबसे कठिन परीक्षा — भारतीय सिविल सेवा (ICS) — पास करें और बड़े अफ़सर बनें। वे इंग्लैंड गए, ख़ूब पढ़े और पूरे साम्राज्य में चौथा स्थान पाया! परिवार ख़ुशी से झूम उठा। "
            "पर सुभाष के मन में एक तकलीफ़ थी। वे उन अंग्रेज़ों के लिए कैसे काम कर सकते हैं जो उनकी मातृभूमि को सता रहे थे? इंग्लैंड के एक शांत पार्क में बैठकर उन्होंने जीवन का सबसे साहसी फ़ैसला लिया — नौकरी शुरू करने से पहले ही उससे इस्तीफ़ा दे दिया। घर चिट्ठी में लिखा, 'जो मेरे लोगों को सता रहे हैं, मैं उनकी सेवा नहीं कर सकता।' "
            "भारत लौटकर सुभाष ने आज़ादी की लड़ाई में हिस्सा लिया। लोग उन्हें इतना प्यार करने लगे कि 'नेताजी' कहने लगे — सम्मानित नेता। उन्होंने महात्मा गांधी के साथ मिलकर काम किया, पर मानते थे कि भारत को तेज़ और साहसी कदम चाहिए। बापू पूर्ण अहिंसा का मार्ग चलते थे; नेताजी मानते थे कि अगर शांतिपूर्ण निवेदन को ठुकराया जाए, तो दबा हुआ राष्ट्र वीर बल भी इस्तेमाल कर सकता है। "
            "जब दूसरा विश्वयुद्ध शुरू हुआ, नेताजी ने सुनहरा अवसर देखा। अंग्रेज़ जर्मनी और जापान से लड़ने में व्यस्त थे। पर उन्हें कलकत्ता में नज़रबंद कर दिया गया। 1941 की एक ठंडी जनवरी रात को 'ज़िअउद्दीन' नाम के पठान बुज़ुर्ग का वेश धरकर वे चुपके से निकले — कार से गोमो, फिर ट्रेन से, फिर अफ़ग़ान पहाड़ों से होते हुए सीधे बर्लिन पहुँचे! वहाँ हिटलर से मदद माँगी, पर जल्द ही लगा कि जर्मनी बहुत दूर है। "
            "फिर उन्होंने और भी जोखिम भरा सफ़र किया — पनडुब्बी से ख़तरनाक समुद्र पार करके जापान, फिर सिंगापुर। वहाँ दक्षिण-पूर्व एशिया में रहने वाले हज़ारों भारतीय सैनिकों और मज़दूरों के सामने नेताजी ने सीना तानकर गरजा — 'तुम मुझे ख़ून दो, मैं तुम्हें आज़ादी दूँगा!' भीड़ ने जवाब दिया — 'जय हिंद!' "
            "उन्होंने आज़ाद हिंद फ़ौज (INA) बनाई — हज़ारों बहादुर स्वयंसेवकों के साथ। रानी झाँसी रेजिमेंट नाम से पूरी महिला सेना बनाई जिसका नेतृत्व कैप्टन लक्ष्मी सहगल ने किया। वे भारत की ओर बढ़े, अंडमान निकोबार जीता, इम्फाल तक पहुँचे, 'चलो दिल्ली!' का नारा लगाते हुए। "
            "18 अगस्त 1945 को कथित रूप से उनका विमान ताइवान के पास दुर्घटनाग्रस्त हो गया और वे इतिहास से लापता हो गए — हालाँकि कई भारतीय आज भी मानते हैं कि वे बच गए थे। सच जो भी हो, उनकी आग कभी बुझी नहीं। बाद में अंग्रेज़ों ने माना कि INA की वीरता और दिल्ली में उसके अफ़सरों के मुक़दमे ने उन्हें भारत छोड़ने पर मजबूर कर दिया। "
            "नेताजी ने साबित किया कि बड़े सपने और बहादुर कार्रवाई सेनाएँ खड़ी कर सकती हैं, समंदर पार कर सकती हैं, और किसी भी साम्राज्य की ज़ंजीरें हिला सकती हैं।"
        ),
        "lessons_en": [
            "Choose your values over easy success. Said no to the most prestigious job because it didn't feel right? That's true courage — like Netaji.",
            "Don't fear hard journeys. If a goal is far away, plan small steps daily — Netaji crossed mountains and oceans one stage at a time.",
            "Lead by inspiring, not by ordering. When working on a school project, give others energy and belief — that's how Netaji built whole armies.",
            "Believe both girls and boys can lead. Netaji's army had a women's regiment 80 years ago — never let anyone tell you what your gender 'cannot' do.",
        ],
        "lessons_hi": [
            "आसान सफलता के बजाय अपने मूल्यों को चुनो। सबसे बड़ी नौकरी इसलिए छोड़ दी क्योंकि वह सही नहीं लगी — यही सच्चा साहस है, जैसे नेताजी का।",
            "मुश्किल यात्रा से मत डरो। अगर लक्ष्य दूर है तो रोज़ छोटे कदम बनाओ — नेताजी ने पहाड़ और समंदर एक-एक पड़ाव पार किए।",
            "हुक्म से नहीं, प्रेरणा से नेतृत्व करो। स्कूल प्रोजेक्ट में दूसरों को ऊर्जा और विश्वास दो — नेताजी ने ऐसे ही पूरी सेनाएँ खड़ी कीं।",
            "मानो कि लड़कियाँ और लड़के दोनों नेतृत्व कर सकते हैं। नेताजी की सेना में 80 साल पहले महिला रेजिमेंट थी — किसी को मत कहने दो कि तुम्हारा लिंग क्या 'नहीं' कर सकता।",
        ],
        "quiz": [
            {"q_en": "What does 'Netaji' mean?", "q_hi": "'नेताजी' का अर्थ क्या है?", "options_en": ["Soldier", "Respected Leader", "Rich man", "Teacher"], "options_hi": ["सैनिक", "सम्मानित नेता", "धनी व्यक्ति", "शिक्षक"], "answer": 1},
            {"q_en": "What army did Netaji build?", "q_hi": "नेताजी ने कौन सी सेना बनाई?", "options_en": ["British Army", "Azad Hind Fauj (INA)", "Mughal Army", "Maratha Army"], "options_hi": ["ब्रिटिश सेना", "आज़ाद हिंद फ़ौज (INA)", "मुग़ल सेना", "मराठा सेना"], "answer": 1},
            {"q_en": "What disguise did Netaji use to escape?", "q_hi": "नेताजी ने भागने के लिए कौन सा भेस धरा?", "options_en": ["A British officer", "A Pathan elder named Ziauddin", "A monk", "A merchant"], "options_hi": ["अंग्रेज़ अफ़सर", "ज़िअउद्दीन नाम के पठान बुज़ुर्ग", "साधु", "व्यापारी"], "answer": 1},
            {"q_en": "Who led the Rani Jhansi Regiment?", "q_hi": "रानी झाँसी रेजिमेंट का नेतृत्व किसने किया?", "options_en": ["Sarojini Naidu", "Captain Lakshmi Sahgal", "Indira Gandhi", "Vijay Lakshmi"], "options_hi": ["सरोजिनी नायडू", "कैप्टन लक्ष्मी सहगल", "इंदिरा गांधी", "विजय लक्ष्मी"], "answer": 1},
            {"q_en": "What was Netaji's famous battle cry?", "q_hi": "नेताजी का प्रसिद्ध युद्ध-घोष क्या था?", "options_en": ["Vande Mataram", "Chalo Dilli", "Jai Bharat", "Hindi Hind"], "options_hi": ["वंदे मातरम्", "चलो दिल्ली", "जय भारत", "हिंदी हिंद"], "answer": 1},
        ],
    },
    {
        "id": "sarojini-naidu",
        "name": "Sarojini Naidu",
        "title_en": "Sarojini Naidu: The Nightingale of India",
        "title_hi": "सरोजिनी नायडू: भारत की कोकिला",
        "tagline_en": "The poet-leader whose words sang freedom into Indian hearts.",
        "tagline_hi": "वह कवयित्री-नेता जिनके शब्दों ने भारतीय दिलों में आज़ादी का गीत गाया।",
        "era": "1879 - 1949",
        "color": "#F4A261",
        "story_en": (
            "In the gardens of Hyderabad, on 13th February 1879, a baby girl was born into a remarkable family. Her father, Aghorenath Chattopadhyay, was a famous scientist, and her mother was a Bengali poet. They named the bright-eyed baby Sarojini, meaning 'lotus'. From the moment she could speak, words flowed from her like a river of music. "
            "Sarojini was a wonder child. By age twelve, she had passed her university entrance exams — earlier than most students! By age thirteen, she had written a 1,300-line poem in English. She read books in English, Urdu, Telugu, Bengali, and Persian. Her teachers called her a 'walking library', and her family called her 'Bulbul' — meaning nightingale — because everything she said sounded like a song. "
            "When she was sixteen, she sailed to England to study at Cambridge University. There, kind professors saw her gift and encouraged her to write only what her heart truly felt — about India, its colours, its people, its perfumed evenings, its singing rivers. So Sarojini began writing poems that the world had never seen before. Soon her books — 'The Golden Threshold', 'The Bird of Time', 'The Broken Wing' — were being read in London, Paris, and Bombay. People started calling her 'Bharat Kokila' — the Nightingale of India. "
            "But Sarojini's heart belonged to her motherland. When she returned home and saw how the British treated Indians, she put down her pen and picked up the cause of freedom. She joined Mahatma Gandhi and the Indian National Congress. In 1925, she became the first Indian woman to be elected President of the Congress — a historic moment. "
            "She walked beside Gandhi on the famous Salt March. When Bapu was arrested at Dandi, it was Sarojini who took over and led 2,000 satyagrahis at the Dharasana Salt Works. The British struck them with sticks, but Sarojini stood firm and told her followers, 'You must not raise a hand even to ward off the blows.' Her courage became world-famous. She was arrested many, many times — but she always smiled, joked with the police, and even cracked funny rhymes about Gandhi (whom she lovingly teased as 'Mickey Mouse'!). "
            "Sarojini also fought for women's rights. She traveled across India inspiring girls to study, to dream big, and to lead. She helped found schools, organized women's conferences, and gave fiery speeches that filled stadiums. People said her voice could make a stone weep and a tired heart leap up to fight. "
            "When India became free in 1947, Pandit Nehru made her the Governor of Uttar Pradesh — making her the first woman Governor of any Indian state. She served with grace and humour, calling herself a 'caged bird' but caring for her people like a mother. "
            "She passed away on 2nd March 1949, but her songs, speeches, and laughter still float through India like a gentle wind. Sarojini taught every Indian child — especially every Indian girl — that words have wings, and a brave voice can fly farther than any sword."
        ),
        "story_hi": (
            "हैदराबाद के बागों में 13 फ़रवरी 1879 को एक ख़ास परिवार में बच्ची का जन्म हुआ। उसके पिता अघोरनाथ चट्टोपाध्याय प्रसिद्ध वैज्ञानिक और माँ बंगाली कवयित्री थीं। चमकती आँखों वाली बच्ची का नाम रखा गया — सरोजिनी, यानी 'कमल'। जब से उन्होंने बोलना शुरू किया, उनके मुँह से शब्द संगीत की नदी की तरह बहने लगे। "
            "सरोजिनी एक अद्भुत बालिका थीं। बारह साल की उम्र में उन्होंने विश्वविद्यालय की प्रवेश परीक्षा पास कर ली — कई बड़ों से पहले! तेरह साल में 1,300 पंक्तियों की अंग्रेज़ी कविता लिख डाली। वे अंग्रेज़ी, उर्दू, तेलुगु, बंगाली और फ़ारसी की किताबें पढ़तीं। शिक्षक उन्हें 'चलती-फिरती लाइब्रेरी' कहते, और परिवार 'बुलबुल' — क्योंकि उनकी हर बात गीत जैसी लगती थी। "
            "सोलह साल की उम्र में वे कैम्ब्रिज विश्वविद्यालय पढ़ने इंग्लैंड गईं। वहाँ अच्छे प्रोफ़ेसरों ने उनकी प्रतिभा देखकर सलाह दी कि वे केवल वही लिखें जो उनका दिल सच में महसूस करता है — भारत के बारे में, उसके रंगों, लोगों, सुगंधित शामों, गाती नदियों के बारे में। फिर सरोजिनी ने ऐसी कविताएँ लिखीं जो दुनिया ने पहले कभी नहीं देखी थीं। जल्द ही उनकी किताबें — 'द गोल्डन थ्रेशोल्ड', 'द बर्ड ऑफ़ टाइम', 'द ब्रोकन विंग' — लंदन, पेरिस और बंबई में पढ़ी जाने लगीं। लोग उन्हें 'भारत कोकिला' कहने लगे। "
            "पर सरोजिनी का दिल मातृभूमि का था। भारत लौटकर अंग्रेज़ी अन्याय देखा, तो क़लम रखकर आज़ादी का काम उठा लिया। महात्मा गांधी और भारतीय राष्ट्रीय कांग्रेस से जुड़ीं। 1925 में वे कांग्रेस की अध्यक्ष चुनी जाने वाली पहली भारतीय महिला बनीं — एक ऐतिहासिक क्षण। "
            "वे प्रसिद्ध दांडी मार्च में गांधी जी के साथ चलीं। जब बापू को दांडी में गिरफ़्तार किया गया, तो सरोजिनी ने धारासाणा नमक कारख़ाने में 2,000 सत्याग्रहियों का नेतृत्व संभाला। अंग्रेज़ों ने लाठियों से मारा, पर सरोजिनी डटी रहीं और साथियों से कहा, 'चोट से बचने के लिए भी हाथ मत उठाना।' उनकी हिम्मत दुनिया भर में मशहूर हो गई। वे कई बार जेल गईं — पर हमेशा मुस्कुराती, पुलिस से मज़ाक़ करतीं, और गांधी जी को प्यार से 'मिकी माउस' तक कहकर चिढ़ातीं! "
            "सरोजिनी ने महिलाओं के अधिकारों के लिए भी आवाज़ उठाई। वे भारत भर घूमकर लड़कियों को पढ़ने, बड़े सपने देखने और नेतृत्व करने की प्रेरणा देतीं। उन्होंने स्कूल खुलवाए, महिला सम्मेलन किए, और भर पूरे स्टेडियम भर देने वाले प्रभावशाली भाषण दिए। लोग कहते थे उनकी आवाज़ पत्थर को रुला सकती थी और थके दिल को कूद कर लड़ने पर मजबूर कर सकती थी। "
            "1947 में आज़ादी मिलने पर पंडित नेहरू ने उन्हें उत्तर प्रदेश का राज्यपाल बनाया — किसी भी भारतीय राज्य की पहली महिला राज्यपाल। उन्होंने ख़ुद को 'पिंजरे की चिड़िया' कहते हुए भी अपने लोगों की माँ की तरह सेवा की। "
            "2 मार्च 1949 को वे चल बसीं, पर उनके गीत, भाषण और हँसी आज भी भारत में हल्की हवा की तरह बहती है। सरोजिनी ने हर भारतीय बच्चे — और ख़ासकर हर भारतीय लड़की — को सिखाया कि शब्दों के पंख होते हैं, और बहादुर आवाज़ किसी भी तलवार से दूर तक उड़ सकती है।"
        ),
        "lessons_en": [
            "Use your words wisely. Write a poem, journal your day, or speak up for someone — words can heal hearts and change the world.",
            "Mix laughter with bravery. Even in tough moments, a kind joke can lift everyone's spirit, like Sarojini did with Gandhi.",
            "Read in many languages. Try a Hindi book, then an English one, then a regional poem — every language opens a new window in your mind.",
            "Lift up other girls. If you see a girl being told she 'can't', stand beside her and say, 'Yes, you can,' just like Sarojini did across India.",
        ],
        "lessons_hi": [
            "अपने शब्दों का सोच-समझकर उपयोग करो। एक कविता लिखो, दिन की डायरी रखो, या किसी के लिए आवाज़ उठाओ — शब्द दिल भर सकते हैं और दुनिया बदल सकते हैं।",
            "बहादुरी के साथ हँसी मिलाओ। मुश्किल पल में भी एक मीठा मज़ाक़ सबका हौसला बढ़ा सकता है, जैसे सरोजिनी ने गांधी जी के साथ किया।",
            "कई भाषाओं में पढ़ो। एक हिंदी किताब, फिर अंग्रेज़ी, फिर कोई क्षेत्रीय कविता — हर भाषा मन में नई खिड़की खोलती है।",
            "बाकी लड़कियों को आगे बढ़ाओ। अगर कोई लड़की सुने कि वह 'नहीं कर सकती', उसके साथ खड़े होकर कहो — 'हाँ, तुम कर सकती हो,' जैसे सरोजिनी ने पूरे भारत में किया।",
        ],
        "quiz": [
            {"q_en": "What was Sarojini Naidu fondly called?", "q_hi": "सरोजिनी नायडू को प्यार से क्या कहा जाता था?", "options_en": ["Iron Lady", "Nightingale of India", "Queen of Songs", "Star of Hyderabad"], "options_hi": ["लौह महिला", "भारत कोकिला", "गीतों की रानी", "हैदराबाद का सितारा"], "answer": 1},
            {"q_en": "At what age did she pass university entrance exams?", "q_hi": "विश्वविद्यालय प्रवेश परीक्षा वे किस उम्र में पास कर गईं?", "options_en": ["10", "12", "16", "18"], "options_hi": ["10", "12", "16", "18"], "answer": 1},
            {"q_en": "She was the first Indian woman President of which body?", "q_hi": "वे किस संस्था की पहली भारतीय महिला अध्यक्ष बनीं?", "options_en": ["Indian Cricket Board", "Indian National Congress", "United Nations", "Royal Society"], "options_hi": ["भारतीय क्रिकेट बोर्ड", "भारतीय राष्ट्रीय कांग्रेस", "संयुक्त राष्ट्र", "रॉयल सोसायटी"], "answer": 1},
            {"q_en": "She became the first woman Governor of which state?", "q_hi": "वे किस राज्य की पहली महिला राज्यपाल बनीं?", "options_en": ["Bihar", "Uttar Pradesh", "Bengal", "Punjab"], "options_hi": ["बिहार", "उत्तर प्रदेश", "बंगाल", "पंजाब"], "answer": 1},
            {"q_en": "What playful nickname did she give Gandhi?", "q_hi": "उन्होंने गांधी जी को कौन सा शरारती नाम दिया?", "options_en": ["Tiger", "Mickey Mouse", "Lion King", "Old Owl"], "options_hi": ["शेर", "मिकी माउस", "लायन किंग", "बूढ़ा उल्लू"], "answer": 1},
        ],
    },
    {
        "id": "chandrashekhar-azad",
        "name": "Chandrashekhar Azad",
        "title_en": "Chandrashekhar Azad: Forever Free",
        "title_hi": "चंद्रशेखर आज़ाद: सदा आज़ाद",
        "tagline_en": "He promised never to be captured — and he kept his word.",
        "tagline_hi": "उन्होंने वादा किया कि कभी पकड़े नहीं जाएँगे — और वादा निभाया।",
        "era": "1906 - 1931",
        "color": "#B8860B",
        "story_en": (
            "Deep in the forests of central India, in the small village of Bhabhra in Madhya Pradesh, on 23rd July 1906, a fearless boy named Chandrashekhar Tiwari was born. His father was a strong, stern man who taught him about the great Bhils — the brave forest tribes who had fought against unfair rulers for centuries. Young Chandrashekhar grew up climbing trees, swimming rivers, and learning to use a bow and arrow before he could even read. The forest taught him to be silent like a panther and brave like a tiger. "
            "When Chandrashekhar was fifteen, the great Non-Cooperation Movement called by Mahatma Gandhi was sweeping India. The boy ran away from his Sanskrit school in Varanasi to join the freedom struggle. During a peaceful protest, he was arrested. They dragged him to a magistrate's court, where the judge tried to scare him. "
            "'What is your name?' the judge thundered. The boy stood straight, looked the judge in the eye, and said boldly, 'My name is Azad — Free!' "
            "'Father's name?' the judge tried again. 'Swatantrata!' — Independence! "
            "'Address?' 'Jail!' "
            "The whole courtroom froze. The judge sentenced him to fifteen lashes with a cane. Each time the cane struck his back, the boy shouted 'Bharat Mata Ki Jai!' He did not flinch. He did not cry. From that day on, the world stopped calling him Chandrashekhar Tiwari. He was now forever Chandrashekhar Azad. "
            "Azad made a sacred promise to himself and to his mother — that the British would never, ever take him alive. He joined the Hindustan Republican Association and turned it into the Hindustan Socialist Republican Association (HSRA), gathering brilliant young revolutionaries — Bhagat Singh, Sukhdev, Rajguru, Bhagwati Charan Vohra, and others. He trained them like the forest had trained him: how to shoot, how to swim, how to disappear into a crowd, and most of all — how to love their motherland more than their own lives. "
            "Azad was a master of disguise. One day he would be a sweeper, the next a saadhu, the next a horse-cart driver. He could vanish into a busy bazaar in seconds. Once, while the police searched a house, he was actually inside dressed as the milkman delivering curd! "
            "He planned the famous Kakori train action, the Saunders shooting (avenging Lala Lajpat Rai's death), and the Assembly bombing. He sheltered Bhagat Singh after these actions, smuggling him from city to city. He believed deeply in equality and welcomed people of every caste and religion into the HSRA. "
            "On 27th February 1931, Azad was meeting a friend in Allahabad's Alfred Park (today proudly called Azad Park) when British police, tipped off by a traitor, surrounded him. Hidden behind a jamun tree, Azad fought back alone like a roaring tiger, holding off many policemen for more than half an hour. "
            "When only one bullet was left in his pistol, he kept his lifelong promise. With his motherland's name on his lips, he used that final bullet himself. The British could only stand and salute the body of a man they had failed to capture. "
            "Even today, the jamun tree at Azad Park stands as a silent witness — and the boy who once told a court his name was 'Free' lived and died as exactly that."
        ),
        "story_hi": (
            "मध्य प्रदेश के मध्य भारत के घने जंगलों में, भाभरा गाँव में, 23 जुलाई 1906 को एक निडर बच्चे का जन्म हुआ — चंद्रशेखर तिवारी। उनके पिता कठोर और ज़बरदस्त इंसान थे जिन्होंने बेटे को महान भीलों — सदियों से अन्याय के विरुद्ध लड़ने वाली वीर वनवासी जातियों — की कहानियाँ सिखाईं। नन्हे चंद्रशेखर पेड़ पर चढ़ते, नदियाँ पार करते, और पढ़ना सीखने से पहले धनुष-बाण चलाना सीख गए थे। जंगल ने उन्हें तेंदुए जैसा शांत और शेर जैसा बहादुर बना दिया। "
            "जब चंद्रशेखर पंद्रह साल के थे, महात्मा गांधी का असहयोग आंदोलन पूरे भारत में फैल रहा था। वे वाराणसी में अपनी संस्कृत पाठशाला से भागकर आज़ादी की लड़ाई में जुड़ गए। एक शांतिपूर्ण प्रदर्शन में पकड़े गए। उन्हें घसीटकर मजिस्ट्रेट की अदालत में लाया गया, जहाँ जज ने उन्हें डराने की कोशिश की। "
            "'तुम्हारा नाम क्या है?' जज ने गरजकर पूछा। लड़का सीना तानकर खड़ा हुआ, जज की आँखों में देखा और निर्भीक होकर बोला — 'मेरा नाम आज़ाद है!' "
            "'पिता का नाम?' — 'स्वतंत्रता!' "
            "'पता?' — 'जेल!' "
            "पूरी अदालत सन्न रह गई। जज ने उन्हें पंद्रह बेंत की सज़ा सुनाई। हर बेंत पर लड़का चिल्लाता — 'भारत माता की जय!' न झुके, न रोए। उस दिन से दुनिया ने उन्हें चंद्रशेखर तिवारी कहना छोड़ दिया। वे हमेशा के लिए चंद्रशेखर आज़ाद बन गए। "
            "आज़ाद ने ख़ुद से और अपनी माँ से एक पवित्र वादा किया — अंग्रेज़ उन्हें कभी जीवित नहीं पकड़ पाएँगे। वे हिंदुस्तान रिपब्लिकन एसोसिएशन से जुड़े और उसे हिंदुस्तान सोशलिस्ट रिपब्लिकन एसोसिएशन (HSRA) बनाया। भगत सिंह, सुखदेव, राजगुरु, भगवती चरण वोहरा जैसे तेजस्वी नौजवानों को इकट्ठा किया। उन्हें वही सिखाया जो जंगल ने उन्हें सिखाया था — गोली चलाना, तैरना, भीड़ में ग़ायब होना, और सबसे ज़्यादा — मातृभूमि को जान से ज़्यादा प्यार करना। "
            "आज़ाद वेश बदलने में माहिर थे। एक दिन झाड़ू वाले, अगले साधु, फिर तांगेवाले। बाज़ार में पल भर में ग़ायब हो जाते। एक बार पुलिस ने एक घर की तलाशी ली, और वे ख़ुद दूधवाले के भेस में दही पहुँचा रहे थे! "
            "उन्होंने प्रसिद्ध काकोरी ट्रेन कांड, सॉन्डर्स वध (लाला लाजपत राय के बदले), और असेंबली बम कांड की योजनाएँ बनाईं। उन्होंने भगत सिंह को इन घटनाओं के बाद शहर-शहर छिपाते हुए सुरक्षित रखा। वे समानता में गहरा विश्वास रखते थे — हर जाति-धर्म के लोगों का HSRA में स्वागत करते। "
            "27 फ़रवरी 1931 को आज़ाद इलाहाबाद के अल्फ्रेड पार्क (आज गर्व से 'आज़ाद पार्क') में एक साथी से मिल रहे थे, तभी एक ग़द्दार की सूचना पर अंग्रेज़ पुलिस ने उन्हें घेर लिया। एक जामुन के पेड़ की आड़ में आज़ाद अकेले गरजते शेर की तरह लड़े, आधे घंटे से ज़्यादा कई पुलिसवालों को रोके रहे। "
            "जब पिस्तौल में सिर्फ़ एक गोली बची, उन्होंने अपना जीवन भर का वादा निभाया। होंठों पर मातृभूमि का नाम लिए, उन्होंने वह आख़िरी गोली ख़ुद चला ली। अंग्रेज़ केवल खड़े होकर सलामी दे सके — एक ऐसे आदमी को जिसे वे कभी पकड़ नहीं पाए। "
            "आज भी आज़ाद पार्क का वह जामुन का पेड़ चुप गवाह बनकर खड़ा है — और वह लड़का जिसने एक बार अदालत में अपना नाम 'आज़ाद' बताया था, वह आज़ाद ही जिया, आज़ाद ही गया।"
        ),
        "lessons_en": [
            "Keep your promises, especially to yourself. If you say 'I'll study one chapter today' — finish it. Small promises kept build a strong character, like Azad's lifelong vow.",
            "Stay calm when scared. Take a deep breath, stand tall, and answer with confidence — even strict teachers respect a steady, polite voice.",
            "Welcome everyone. Azad's team had Hindus, Muslims, Sikhs, rich and poor — all equal. Make your friend group open to every kind of person.",
            "Be quick to learn many skills. Azad could disappear into any role. Try learning a new sport, a new instrument, or a new craft — versatile kids grow into versatile leaders.",
        ],
        "lessons_hi": [
            "वादे निभाओ, ख़ासकर अपने आप से। अगर कहो 'आज एक अध्याय पढ़ूँगा' — तो ज़रूर पढ़ो। छोटे-छोटे निभाए गए वादे मज़बूत चरित्र बनाते हैं, जैसे आज़ाद का जीवन भर का वचन।",
            "डरते समय शांत रहो। गहरी साँस लो, सीना तानो, और आत्मविश्वास से उत्तर दो — सख़्त शिक्षक भी शांत, विनम्र आवाज़ का सम्मान करते हैं।",
            "सबका स्वागत करो। आज़ाद की टोली में हिंदू-मुसलमान-सिख, अमीर-ग़रीब — सब बराबर थे। अपने दोस्तों के दायरे को हर तरह के व्यक्ति के लिए खुला रखो।",
            "कई हुनर जल्दी सीखो। आज़ाद किसी भी भूमिका में ग़ायब हो सकते थे। नया खेल, नया वाद्ययंत्र, नया हुनर सीखो — कई कलाओं वाले बच्चे बहुमुखी नेता बनते हैं।",
        ],
        "quiz": [
            {"q_en": "What name did Chandrashekhar give the judge?", "q_hi": "चंद्रशेखर ने जज को कौन सा नाम बताया?", "options_en": ["Ram", "Azad", "Bhagat", "Subhash"], "options_hi": ["राम", "आज़ाद", "भगत", "सुभाष"], "answer": 1},
            {"q_en": "What 'address' did he tell the court?", "q_hi": "उन्होंने कोर्ट में कौन सा 'पता' बताया?", "options_en": ["Home", "Jail", "School", "Forest"], "options_hi": ["घर", "जेल", "स्कूल", "जंगल"], "answer": 1},
            {"q_en": "What organization did Azad lead?", "q_hi": "आज़ाद ने कौन सा संगठन चलाया?", "options_en": ["INA", "HSRA", "Congress", "Khudai Khidmatgar"], "options_hi": ["INA", "HSRA", "कांग्रेस", "ख़ुदाई ख़िदमतगार"], "answer": 1},
            {"q_en": "Which park is now named after him?", "q_hi": "अब कौन सा पार्क उनके नाम पर है?", "options_en": ["Lodhi Park", "Azad Park", "Cubbon Park", "Hyde Park"], "options_hi": ["लोधी पार्क", "आज़ाद पार्क", "कब्बन पार्क", "हाइड पार्क"], "answer": 1},
            {"q_en": "What kind of tree did Azad take cover behind?", "q_hi": "आज़ाद किस पेड़ की आड़ में लड़े?", "options_en": ["Mango", "Jamun", "Banyan", "Peepal"], "options_hi": ["आम", "जामुन", "बरगद", "पीपल"], "answer": 1},
        ],
    },
    {
        "id": "mangal-pandey",
        "name": "Mangal Pandey",
        "title_en": "Mangal Pandey: The First Spark",
        "title_hi": "मंगल पांडे: पहली चिंगारी",
        "tagline_en": "The brave soldier who lit the spark of India's first freedom fight.",
        "tagline_hi": "वह बहादुर सिपाही जिसने भारत की पहली आज़ादी की लड़ाई की चिंगारी जलाई।",
        "era": "1827 - 1857",
        "color": "#D72638",
        "story_en": (
            "In a small village called Nagwa in Uttar Pradesh, on 19th July 1827, a strong, broad-shouldered baby boy was born and named Mangal Pandey. He grew up among golden mustard fields, learning to wrestle, ride, and shoot from his elder uncles. His family was deeply religious, proud Brahmins who taught him to keep his honour like he kept his prayers — every single day. "
            "When Mangal was twenty-two, like many young men of his time, he joined the British East India Company's army as a sepoy — an Indian soldier. He was tall, six feet two inches, with bright eyes and a quiet, polite manner. He served in the 34th Bengal Native Infantry, posted at the Barrackpore cantonment near Calcutta. He polished his musket every morning, sang folk songs in the evening, and sent half his pay home to his old mother. "
            "Indian sepoys were brave fighters. They had helped the British win battle after battle — but they were paid less, treated rudely, and often insulted. Still, they served — until something terrible happened. "
            "In early 1857, the army gave its sepoys a new weapon — the Enfield rifle. Its bullets came in greased paper cartridges, and to load the rifle, the soldier had to bite open the paper. Then a whisper spread through every cantonment in India like fire: the grease was made of cow fat and pig fat. For Hindu sepoys, biting cow grease was a deep insult to their faith. For Muslim sepoys, pig grease was equally forbidden. The British officers laughed it off, but the sepoys felt their soul was being attacked. "
            "Mangal Pandey could not bear it. To him, his religion and his honour were dearer than his life. On the hot afternoon of 29th March 1857, dressed in his red coat, with a loaded musket and a sword, Mangal walked out onto the parade ground at Barrackpore. He was upset, brave, and wide awake. "
            "He shouted to his fellow sepoys: 'Brothers! Come out! For our religion, for our motherland — rise! These cartridges will destroy our faith! Come out and fight!' "
            "When the British Sergeant-Major Hewson rode up to arrest him, Mangal raised his musket and fired. He fought alone, fearless, surrounded. Other sepoys watched silently — some too afraid, some unsure. When he finally ran out of ammunition, Mangal turned the musket on himself rather than be captured — but he was wounded and taken alive. "
            "On 8th April 1857, only ten days later, Mangal Pandey was hanged at Barrackpore. He went to the gallows with a steady walk and a calm face. He had lit a tiny spark — but that spark turned into a forest fire. "
            "Within weeks, sepoys across northern India rose up — at Meerut, Delhi, Lucknow, Kanpur, Jhansi. The Great Revolt of 1857 had begun — what Indians call our First War of Independence. Though it was crushed by 1858, it shook the British Empire so deeply that the entire East India Company was abolished. "
            "Mangal Pandey was just one young soldier. But by saying 'enough' on one afternoon, he proved that a single brave 'No' can change the destiny of an entire nation."
        ),
        "story_hi": (
            "उत्तर प्रदेश के नगवा गाँव में 19 जुलाई 1827 को एक मज़बूत, चौड़े कंधों वाले बच्चे का जन्म हुआ — मंगल पांडे। वे सरसों के सुनहरे खेतों के बीच पले, बड़े चाचाओं से कुश्ती, घुड़सवारी और निशानेबाज़ी सीखी। उनका परिवार धार्मिक, स्वाभिमानी ब्राह्मण था, जिसने सिखाया कि सम्मान को प्रार्थना की तरह रोज़ संभालो। "
            "बाईस साल की उम्र में, अपने ज़माने के कई नौजवानों की तरह, मंगल ब्रिटिश ईस्ट इंडिया कंपनी की सेना में सिपाही बन गए। वे लंबे — 6 फ़ुट 2 इंच — चमकती आँखों वाले, शांत और विनम्र थे। वे 34वीं बंगाल नेटिव इन्फ़ैंट्री में थे, कलकत्ता के पास बैरकपुर छावनी में तैनात। हर सुबह बंदूक चमकाते, शाम को लोकगीत गाते, और आधी तनख़्वाह बूढ़ी माँ को भेज देते। "
            "भारतीय सिपाही वीर लड़ाके थे। उन्होंने अंग्रेज़ों को कई लड़ाइयाँ जिताई थीं — पर उन्हें कम तनख़्वाह मिलती, बेइज़्ज़ती होती, अपमान सहना पड़ता। फिर भी सेवा करते रहे — जब तक एक भयानक बात नहीं हुई। "
            "1857 की शुरुआत में सेना ने नई बंदूक दी — एनफ़ील्ड राइफ़ल। उसकी गोलियाँ चिकने (ग्रीस वाले) काग़ज़ी पुड़ियों में आती थीं, और बंदूक भरने के लिए सिपाही को पुड़ी मुँह से काटनी पड़ती थी। हर छावनी में फुसफुसाहट आग की तरह फैली — चिकनाई गाय और सूअर की चर्बी की है। हिंदू सिपाहियों के लिए गाय की चर्बी आस्था पर गहरा आघात थी। मुसलमान सिपाहियों के लिए सूअर की चर्बी उतनी ही वर्जित। अंग्रेज़ अफ़सर हँसकर टाल देते, पर सिपाहियों को लगा उनकी आत्मा पर वार किया जा रहा है। "
            "मंगल पांडे यह सहन नहीं कर पाए। उनके लिए धर्म और सम्मान जान से प्यारे थे। 29 मार्च 1857 की गर्म दोपहर, लाल कोट पहने, भरी बंदूक और तलवार लिए, मंगल बैरकपुर के परेड ग्राउंड पर निकल आए। वे गुस्से में, बहादुर, पूरी तरह सजग थे। "
            "वे साथी सिपाहियों से चिल्लाए — 'भाइयो! बाहर निकलो! धर्म के लिए, मातृभूमि के लिए — उठो! ये गोलियाँ हमारी आस्था ख़त्म कर देंगी! बाहर आओ, लड़ो!' "
            "जब अंग्रेज़ सार्जेंट-मेजर ह्यूसन उन्हें गिरफ़्तार करने आया, मंगल ने बंदूक उठाकर गोली चला दी। वे अकेले, निर्भीक, घिरे हुए लड़े। बाक़ी सिपाही चुपचाप देखते रहे — कुछ डर से, कुछ अनिश्चितता से। जब गोलियाँ ख़त्म हुईं, तो पकड़े जाने से बेहतर समझकर मंगल ने ख़ुद पर बंदूक चलाई — पर वे घायल होकर ज़िंदा पकड़े गए। "
            "8 अप्रैल 1857, मात्र दस दिन बाद, मंगल पांडे को बैरकपुर में फाँसी दी गई। वे शांत क़दमों और स्थिर चेहरे से तख़्त पर चढ़े। उन्होंने एक छोटी चिंगारी जलाई थी — पर वह चिंगारी जंगल की आग बन गई। "
            "कुछ हफ़्तों में पूरे उत्तर भारत के सिपाही उठ खड़े हुए — मेरठ, दिल्ली, लखनऊ, कानपुर, झाँसी। 1857 का महान विद्रोह शुरू हो गया — जिसे भारतीय 'प्रथम स्वतंत्रता संग्राम' कहते हैं। 1858 तक यह कुचल दिया गया, पर इसने ब्रिटिश साम्राज्य को इतना हिलाया कि पूरी ईस्ट इंडिया कंपनी ही ख़त्म कर दी गई। "
            "मंगल पांडे एक नौजवान सिपाही थे। पर एक दोपहर 'बहुत हुआ' कहकर उन्होंने साबित कर दिया कि एक बहादुर 'नहीं' पूरे राष्ट्र की नियति बदल सकती है।"
        ),
        "lessons_en": [
            "Say 'No' kindly but firmly when something feels wrong. If a friend asks you to copy in an exam, refuse — that's your inner Mangal speaking.",
            "Respect every religion. Mangal stood up because his faith mattered. Learn one good thing from each religion in your class — that's true courage.",
            "Even alone, you can be the spark. Class has a problem nobody is solving? Be the first to raise your hand. One brave kid often inspires many.",
            "Honour your roots. Send a 'thank you' message to your parents or grandparents today — Mangal sent half his pay home; small gestures keep love alive.",
        ],
        "lessons_hi": [
            "जब कुछ ग़लत लगे तो प्यार से लेकिन दृढ़ता से 'नहीं' कहो। दोस्त परीक्षा में नक़ल करवाने को कहे, तो इनकार करो — यही तुम्हारे अंदर का मंगल बोल रहा है।",
            "हर धर्म का सम्मान करो। मंगल अपनी आस्था की वजह से उठे थे। अपनी कक्षा के हर धर्म से एक अच्छी बात सीखो — यही सच्चा साहस है।",
            "अकेले भी तुम चिंगारी बन सकते हो। कक्षा में कोई समस्या है और कोई हल नहीं कर रहा? सबसे पहले हाथ उठाओ। एक बहादुर बच्चा कई को प्रेरित करता है।",
            "अपनी जड़ों का सम्मान करो। आज माता-पिता या दादा-दादी को 'धन्यवाद' का संदेश भेजो — मंगल आधी तनख़्वाह घर भेजते थे; छोटे काम प्रेम जिलाते हैं।",
        ],
        "quiz": [
            {"q_en": "What was Mangal Pandey's job?", "q_hi": "मंगल पांडे का काम क्या था?", "options_en": ["Farmer", "Sepoy (soldier)", "Teacher", "Trader"], "options_hi": ["किसान", "सिपाही", "शिक्षक", "व्यापारी"], "answer": 1},
            {"q_en": "What was wrong with the new bullets?", "q_hi": "नई गोलियों में क्या समस्या थी?", "options_en": ["Too small", "Greased with animal fat", "Too heavy", "Made of wood"], "options_hi": ["बहुत छोटी", "पशु चर्बी से लिपटी", "बहुत भारी", "लकड़ी की"], "answer": 1},
            {"q_en": "On what date did Mangal Pandey revolt?", "q_hi": "मंगल पांडे ने किस तारीख़ को बग़ावत की?", "options_en": ["29 March 1857", "15 August 1857", "26 January 1857", "2 October 1857"], "options_hi": ["29 मार्च 1857", "15 अगस्त 1857", "26 जनवरी 1857", "2 अक्टूबर 1857"], "answer": 0},
            {"q_en": "Where did the revolt begin?", "q_hi": "विद्रोह कहाँ शुरू हुआ?", "options_en": ["Delhi", "Barrackpore", "Bombay", "Madras"], "options_hi": ["दिल्ली", "बैरकपुर", "बंबई", "मद्रास"], "answer": 1},
            {"q_en": "What did Mangal Pandey's spark start?", "q_hi": "मंगल पांडे की चिंगारी ने क्या शुरू किया?", "options_en": ["A festival", "First War of Independence", "A school", "A new religion"], "options_hi": ["एक त्योहार", "प्रथम स्वतंत्रता संग्राम", "एक स्कूल", "नया धर्म"], "answer": 1},
        ],
    },
    {
        "id": "bhimrao-ambedkar",
        "name": "Dr. B. R. Ambedkar",
        "title_en": "Dr. B. R. Ambedkar: The Architect of Freedom",
        "title_hi": "डॉ. बी. आर. अंबेडकर: आज़ादी के निर्माता",
        "tagline_en": "He fought for fairness — and wrote the very book of free India.",
        "tagline_hi": "उन्होंने न्याय के लिए लड़ाई लड़ी — और आज़ाद भारत की पुस्तक लिखी।",
        "era": "1891 - 1956",
        "color": "#3949AB",
        "story_en": (
            "On 14th April 1891, in the cantonment town of Mhow in Madhya Pradesh, a baby boy was born into a Mahar family — a community that the cruel caste system labelled 'untouchable'. His parents, Ramji and Bhimabai Sakpal, named him Bhimrao. Even as a tiny boy, his eyes shone with a hunger to learn that the world had never seen before. "
            "Bhim adored school. But school did not adore him. Because of his caste, he was not allowed to sit on the wooden benches with the other children. He had to bring a torn piece of gunny cloth from home, lay it on the floor in a corner, and sit alone. He was not allowed to drink from the common water pot — sometimes the school peon poured water from above into his cupped hands; on days the peon was absent, Bhim went thirsty. The Sanskrit teacher refused to teach him 'sacred' words. "
            "Most children would have broken. But Bhim's father told him something he never forgot: 'Beta, study so hard, become so wise, that no one can ever silence you again.' So Bhim studied like a fire. He woke before sunrise, walked miles to school, read by the light of streetlamps in the evening. He topped his class. He topped Bombay University. The Maharaja of Baroda gave him a scholarship and Bhim sailed all the way to Columbia University in America, then to the London School of Economics in England. He earned not one or two but many degrees, becoming one of the most highly educated Indians of his time. "
            "When he returned, India still treated him cruelly because of his caste. He was a brilliant scholar with a doctorate from America — yet some places would not give him a glass of water. Babasaheb (as people lovingly called him) decided he would dedicate his life to ending this unfair treatment for everyone. "
            "He started newspapers like 'Mooknayak' (Leader of the Voiceless), opened schools, organized protests where Dalits drank from public ponds for the first time in centuries. In 1927, at the famous Mahad Satyagraha, he led thousands of people to drink water from a public tank — a peaceful but earth-shaking act. He also publicly burned a copy of the Manusmriti, an old text that supported caste discrimination, declaring that no book is sacred if it makes humans unequal. "
            "Babasaheb worked alongside — and sometimes argued strongly with — Mahatma Gandhi about how to end caste injustice fastest. They disagreed often, but both agreed India had to be free AND fair. "
            "When India became independent in 1947, the country needed a new rulebook — the Constitution. Pandit Nehru chose Babasaheb to lead the team that would write it. For two years, eleven months, and seventeen days, Babasaheb worked tirelessly, often when sick, building the longest written constitution in the world. He made sure it gave EVERY Indian — boy, girl, rich, poor, of any caste, religion, or language — equal rights, equal vote, and equal dignity. "
            "He fought to give women the right to inherit property, to divorce, to study, and to vote — through what he called the Hindu Code Bill. When some politicians blocked it, he resigned in protest. "
            "Towards the end of his life, Babasaheb embraced Buddhism with hundreds of thousands of his followers, choosing a religion that taught equality. He passed away on 6th December 1956, leaving behind not just laws, but a free, fair Indian dream. "
            "Today, every time an Indian votes, every time a girl goes to college, every time a child says 'we are all equal' — Babasaheb is quietly smiling."
        ),
        "story_hi": (
            "14 अप्रैल 1891 को मध्य प्रदेश के महू छावनी में एक महार परिवार में बच्चे का जन्म हुआ — एक समुदाय जिसे क्रूर जाति-व्यवस्था ने 'अछूत' कहकर लांछित किया था। माता-पिता रामजी और भीमाबाई सकपाल ने नाम रखा भीमराव। नन्हे से ही उनकी आँखों में सीखने की ऐसी भूख चमकती थी जो दुनिया ने पहले नहीं देखी थी। "
            "भीम को स्कूल जाना बहुत प्यारा था। पर स्कूल को वे प्यारे नहीं थे। जाति की वजह से उन्हें बाक़ी बच्चों के साथ लकड़ी की बेंच पर बैठने नहीं दिया जाता था। वे घर से फटा-पुराना बोरा लाते, कोने में बिछाते और अकेले बैठते। साझा पानी के घड़े से पानी पीने की अनुमति नहीं थी — कभी-कभी स्कूल का चपरासी ऊपर से उनकी अंजुली में पानी डालता; जिस दिन चपरासी नहीं आता, भीम प्यासे रहते। संस्कृत के शिक्षक ने उन्हें 'पवित्र' श्लोक पढ़ाने से मना कर दिया। "
            "बहुत-से बच्चे टूट जाते। पर पिता ने भीम से कहा एक बात जो वे कभी न भूले — 'बेटा, इतना पढ़ो, इतने ज्ञानी बनो कि कोई फिर कभी तुम्हें चुप नहीं करा सके।' भीम ने आग की तरह पढ़ाई की। सूरज से पहले उठते, मीलों पैदल स्कूल जाते, शाम को सड़क के दीयों की रोशनी में पढ़ते। वे कक्षा में अव्वल आए, बंबई विश्वविद्यालय में अव्वल आए। बड़ौदा के महाराजा ने वज़ीफ़ा दिया और भीम अमेरिका के कोलंबिया विश्वविद्यालय गए, फिर इंग्लैंड के लंदन स्कूल ऑफ़ इकोनॉमिक्स। उन्होंने एक नहीं, कई डिग्रियाँ हासिल कीं और अपने ज़माने के सबसे शिक्षित भारतीयों में से एक बने। "
            "जब वे लौटे, भारत ने जाति की वजह से उनके साथ अब भी क्रूर बर्ताव किया। अमेरिका से डॉक्टरेट करके आए विद्वान को कहीं-कहीं पानी का गिलास तक नहीं मिलता। बाबासाहेब (जैसा सब प्यार से कहते) ने तय किया कि अपना पूरा जीवन इस अन्याय को मिटाने में लगाएँगे। "
            "उन्होंने 'मूकनायक' (बेज़ुबानों का नेता) जैसे अख़बार शुरू किए, स्कूल खोले, और ऐसे आंदोलन किए जिनमें दलितों ने सदियों में पहली बार सार्वजनिक तालाबों से पानी पिया। 1927 के प्रसिद्ध महाड़ सत्याग्रह में उन्होंने हज़ारों लोगों का नेतृत्व करके सार्वजनिक तालाब से पानी पिलाया — शांतिपूर्ण लेकिन धरती हिला देने वाला कार्य। उन्होंने मनुस्मृति की प्रति सार्वजनिक रूप से जलाई, यह घोषित करते हुए कि कोई भी पुस्तक पवित्र नहीं है अगर वह मनुष्यों को असमान बनाती है। "
            "बाबासाहेब ने महात्मा गांधी के साथ काम किया — और कई बार जोरदार बहस भी की — कि जाति-अन्याय कैसे जल्दी मिटे। मतभेद बहुत थे, पर दोनों मानते थे कि भारत आज़ाद होने के साथ-साथ न्यायसंगत भी होना चाहिए। "
            "1947 में आज़ादी के बाद देश को नया नियम-पुस्तक चाहिए था — संविधान। पंडित नेहरू ने इसे लिखने वाली टीम का नेतृत्व बाबासाहेब को सौंपा। दो साल, ग्यारह महीने और सत्रह दिन तक, बीमार रहकर भी, उन्होंने अथक मेहनत की और दुनिया का सबसे लंबा लिखित संविधान रचा। उन्होंने सुनिश्चित किया कि हर भारतीय — लड़का, लड़की, अमीर, ग़रीब, किसी भी जाति, धर्म, भाषा का — समान अधिकार, समान वोट, समान सम्मान पाए। "
            "उन्होंने महिलाओं को संपत्ति में हिस्सा, तलाक़, शिक्षा और वोट का अधिकार दिलाने के लिए 'हिंदू कोड बिल' की लड़ाई लड़ी। जब कुछ नेताओं ने इसे रोका, तो विरोध में इस्तीफ़ा दे दिया। "
            "जीवन के अंत में बाबासाहेब ने अपने लाखों अनुयायियों के साथ बौद्ध धर्म अपनाया — एक ऐसा धर्म जो समानता सिखाता था। 6 दिसंबर 1956 को वे चल बसे, पीछे छोड़ गए सिर्फ़ क़ानून ही नहीं, बल्कि एक आज़ाद और न्यायसंगत भारत का सपना। "
            "आज जब भी कोई भारतीय वोट डालता है, कोई लड़की कॉलेज जाती है, कोई बच्चा कहता है 'हम सब बराबर हैं' — बाबासाहेब चुपचाप मुस्कुराते हैं।"
        ),
        "lessons_en": [
            "Education is your superpower. Whatever subject feels hard — give it 20 extra minutes a day. Bhim outshone an empire by out-studying it.",
            "Treat everyone equally. Don't decide who's your friend based on caste, religion, or money — share your tiffin with anyone, especially someone sitting alone.",
            "Speak up against unfairness. If you see classmates excluding someone, gently invite the left-out kid to play. That's a Mahad Satyagraha in your own playground.",
            "Stand up for girls' rights. Babasaheb fought so girls can study, vote, and own property. Encourage your sisters and friends to dream big — and walk with them in that dream.",
        ],
        "lessons_hi": [
            "शिक्षा तुम्हारी महाशक्ति है। जो विषय कठिन लगे, उसे रोज़ 20 अतिरिक्त मिनट दो। भीम ने पूरे साम्राज्य को पढ़ाई से हराया।",
            "सबसे एक जैसा बर्ताव करो। जाति, धर्म या पैसे के आधार पर दोस्त मत चुनो — टिफ़िन सबसे बाँटो, ख़ासकर अकेले बैठे बच्चे के साथ।",
            "अन्याय के विरुद्ध आवाज़ उठाओ। अगर सहपाठी किसी को बाहर कर रहे हों, तो प्यार से उस अकेले बच्चे को खेल में बुलाओ — यह तुम्हारे मैदान का महाड़ सत्याग्रह है।",
            "लड़कियों के अधिकारों के लिए खड़े हो जाओ। बाबासाहेब इसलिए लड़े कि लड़कियाँ पढ़ें, वोट दें, संपत्ति पाएँ। अपनी बहनों और दोस्तों को बड़े सपने देखने को कहो — और उनके सपनों में साथ चलो।",
        ],
        "quiz": [
            {"q_en": "What did young Bhimrao have to sit on at school?", "q_hi": "स्कूल में नन्हे भीमराव को किस पर बैठना पड़ता था?", "options_en": ["Bench", "Torn cloth on floor", "Soft chair", "Mat"], "options_hi": ["बेंच पर", "फटे कपड़े पर", "गद्देदार कुर्सी पर", "चटाई पर"], "answer": 1},
            {"q_en": "What was Babasaheb's biggest contribution?", "q_hi": "बाबासाहेब का सबसे बड़ा योगदान क्या था?", "options_en": ["Wrote India's Constitution", "Built a fort", "Wrote songs", "Sailed ships"], "options_hi": ["भारत का संविधान लिखा", "एक क़िला बनाया", "गीत लिखे", "जहाज़ चलाए"], "answer": 0},
            {"q_en": "Which famous protest did he lead in 1927?", "q_hi": "1927 में उन्होंने कौन सा प्रसिद्ध आंदोलन किया?", "options_en": ["Salt March", "Mahad Satyagraha", "Quit India", "Dandi March"], "options_hi": ["नमक यात्रा", "महाड़ सत्याग्रह", "भारत छोड़ो", "दांडी यात्रा"], "answer": 1},
            {"q_en": "Which religion did Babasaheb embrace at the end?", "q_hi": "बाबासाहेब ने अंत में कौन सा धर्म अपनाया?", "options_en": ["Christianity", "Buddhism", "Islam", "Sikhism"], "options_hi": ["ईसाई", "बौद्ध", "इस्लाम", "सिख"], "answer": 1},
            {"q_en": "What is the strongest weapon, per Babasaheb?", "q_hi": "बाबासाहेब के अनुसार सबसे मज़बूत हथियार क्या है?", "options_en": ["A sword", "Education", "Money", "Speed"], "options_hi": ["तलवार", "शिक्षा", "पैसा", "गति"], "answer": 1},
        ],
    },
]

BADGES = [
    {"id": "first_story", "name": "First Step", "icon": "footsteps", "desc": "Read your first story"},
    {"id": "five_stories", "name": "Story Explorer", "icon": "book", "desc": "Read 5 stories"},
    {"id": "all_stories", "name": "Freedom Champion", "icon": "trophy", "desc": "Read all 8 stories"},
    {"id": "perfect_quiz", "name": "Truth Seeker", "icon": "star", "desc": "Score 100% on a quiz"},
    {"id": "three_quizzes", "name": "Quiz Master", "icon": "school", "desc": "Complete 3 quizzes"},
    {"id": "streak_3", "name": "Brave Heart", "icon": "flame", "desc": "Maintain a 3-day streak"},
    {"id": "chat_azaadi", "name": "Wise Companion", "icon": "chatbubbles", "desc": "Chat with Azaadi"},
]

LEVELS = [
    {"level": 1, "name": "Young Patriot", "min_xp": 0},
    {"level": 2, "name": "Curious Explorer", "min_xp": 50},
    {"level": 3, "name": "Brave Cadet", "min_xp": 150},
    {"level": 4, "name": "Story Hero", "min_xp": 300},
    {"level": 5, "name": "Truth Warrior", "min_xp": 500},
    {"level": 6, "name": "Freedom Champion", "min_xp": 800},
]


def get_level_for_xp(xp: int):
    current = LEVELS[0]
    for lvl in LEVELS:
        if xp >= lvl["min_xp"]:
            current = lvl
    return current


# ==========================================================
# Extend STORIES with regional heroes (north, east, more)
# ==========================================================
try:
    from stories_seed_north import NORTH_STORIES
    STORIES.extend(NORTH_STORIES)
except Exception as _e:
    pass

try:
    from stories_seed_east import EAST_STORIES
    STORIES.extend(EAST_STORIES)
except Exception as _e:
    pass

try:
    from stories_seed_more import MORE_STORIES
    STORIES.extend(MORE_STORIES)
except Exception as _e:
    pass


# ==========================================================
# Hunt-related badges
# ==========================================================
BADGES.extend([
    {"id": "hunt_1857", "name": "1857 Detective", "icon": "flame", "desc": "Solve the Great Revolt hunt"},
    {"id": "hunt_women", "name": "Veerangana", "icon": "rose", "desc": "Solve the Women Warriors hunt"},
    {"id": "hunt_youth", "name": "Young Tiger", "icon": "flash", "desc": "Solve the Young Revolutionaries hunt"},
])

# Update "all_stories" badge description to reflect new total
for _b in BADGES:
    if _b.get("id") == "all_stories":
        _b["desc"] = f"Read all {len(STORIES)} stories"
        break
