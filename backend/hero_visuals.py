"""Per-hero visual metadata: monument mapping + AI image-generation prompt.

Monuments are 9 archetypes that the frontend knows how to draw as animated SVG
silhouettes. Each story is mapped to the monument most associated with that
hero's region or movement.

Available monument keys (frontend will switch on this):
  red_fort        - Red Fort, Delhi (Mughal arches + dome) - used for national leaders, INA, Mughal-era figures
  india_gate      - India Gate, Delhi (single archway + flame)
  jhansi_fort     - Jhansi Fort (battlement silhouette)
  sabarmati       - Sabarmati Ashram (small hut with charkha sun)
  jallianwala     - Jallianwala Bagh memorial (eternal flame + pillar)
  charminar       - Charminar, Hyderabad (4 minarets) - used for southern/Hyderabad heroes
  kashmiri_gate   - Punjab gurudwara dome (used for Punjab heroes)
  gateway_india   - Gateway of India, Mumbai (Indo-Saracenic arch) - west/maritime heroes
  ashoka_pillar   - Sarnath Ashoka pillar (4 lions on capital)
"""

HERO_VISUALS = {
    # ---------- Base 8 heroes ----------
    "bhagat-singh": {
        "monument": "kashmiri_gate",
        "portrait_prompt": (
            "A warm, kid-friendly illustrated portrait of Bhagat Singh, young 23-year-old Indian "
            "revolutionary, wearing his iconic yellow turban and thin moustache, slight smile, "
            "bright determined eyes, simple white kurta, looking forward. Soft watercolor cartoon "
            "style for a children's storybook. Centered head-and-shoulders composition. Plain "
            "off-white parchment background. Indian flag tricolor subtle glow behind."
        ),
    },
    "rani-lakshmibai": {
        "monument": "jhansi_fort",
        "portrait_prompt": (
            "A warm illustrated portrait of Rani Lakshmibai of Jhansi, brave young Indian warrior "
            "queen of the 1850s, wearing a maroon and gold sari with armor plates, jewellery, "
            "long black hair tied back, determined kind face, looking forward. Children's storybook "
            "cartoon watercolor style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "mahatma-gandhi": {
        "monument": "sabarmati",
        "portrait_prompt": (
            "A gentle illustrated portrait of Mahatma Gandhi, kind elderly Indian leader, bald, "
            "round wire-rim glasses, soft warm smile, white khadi shawl draped over his shoulder, "
            "wrinkled but cheerful face. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "subhas-bose": {
        "monument": "red_fort",
        "portrait_prompt": (
            "An illustrated portrait of Netaji Subhas Chandra Bose, brave Indian leader of INA, "
            "wearing his iconic dark green military-style cap and uniform with brass buttons, "
            "round glasses, strong jawline, intense kind eyes, slight smile. Children's storybook "
            "watercolor cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "sarojini-naidu": {
        "monument": "charminar",
        "portrait_prompt": (
            "A gentle illustrated portrait of Sarojini Naidu, Indian poetess and freedom fighter, "
            "warm motherly face, hair in a bun, wearing a peach-orange sari with golden border, "
            "small bindi, gentle smile, looking forward. Children's storybook watercolor cartoon "
            "style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "chandrashekhar-azad": {
        "monument": "ashoka_pillar",
        "portrait_prompt": (
            "An illustrated portrait of Chandrashekhar Azad, brave young Indian revolutionary, "
            "thick handlebar moustache, bare-chested with sacred thread, traditional dhoti, strong "
            "muscular build, fierce kind eyes, hair tied back. Children's storybook watercolor "
            "cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "mangal-pandey": {
        "monument": "red_fort",
        "portrait_prompt": (
            "An illustrated portrait of Mangal Pandey, Indian sepoy of 1857, wearing the red "
            "British East India Company sepoy coat with brass buttons, tall turban with feather, "
            "thick moustache, brave determined face. Children's storybook watercolor cartoon "
            "style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "bhimrao-ambedkar": {
        "monument": "ashoka_pillar",
        "portrait_prompt": (
            "A dignified illustrated portrait of Dr. B.R. Ambedkar, wise Indian scholar and "
            "architect of the Constitution, wearing a blue formal suit with a red tie, round "
            "thick-rim glasses, neatly combed black hair, holding a large book, warm intelligent "
            "smile. Children's storybook watercolor cartoon style. Head-and-shoulders. Plain "
            "off-white parchment background."
        ),
    },
    # ---------- North ----------
    "sardar-patel": {
        "monument": "red_fort",
        "portrait_prompt": (
            "An illustrated portrait of Sardar Vallabhbhai Patel, the Iron Man of India, elderly "
            "kind face, bald with grey hair on the sides, wearing a simple white dhoti and white "
            "shawl over shoulder, stern but loving expression. Children's storybook watercolor "
            "cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "lala-lajpat-rai": {
        "monument": "kashmiri_gate",
        "portrait_prompt": (
            "An illustrated portrait of Lala Lajpat Rai, 'Punjab Kesari', elderly Indian leader, "
            "grey beard and moustache, wearing a saffron-yellow turban and a kurta with a brown "
            "shawl, brave fatherly eyes. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "tilak": {
        "monument": "gateway_india",
        "portrait_prompt": (
            "An illustrated portrait of Bal Gangadhar Tilak, wise Marathi leader, big bushy white "
            "moustache, white Pheta-style turban, simple white shawl, calm fatherly eyes. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white "
            "parchment background."
        ),
    },
    "sukhdev": {
        "monument": "kashmiri_gate",
        "portrait_prompt": (
            "An illustrated portrait of Sukhdev Thapar, young 23-year-old Indian revolutionary, "
            "round face, thin moustache, wavy short hair, simple kurta, brave kind eyes. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white "
            "parchment background."
        ),
    },
    "rajguru": {
        "monument": "kashmiri_gate",
        "portrait_prompt": (
            "An illustrated portrait of Shivaram Rajguru, young 22-year-old Indian revolutionary "
            "marksman, short hair, thin moustache, intense focused eyes, plain off-white kurta. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white "
            "parchment background."
        ),
    },
    # ---------- East ----------
    "khudiram-bose": {
        "monument": "jallianwala",
        "portrait_prompt": (
            "An illustrated portrait of Khudiram Bose, brave 18-year-old Bengali revolutionary, "
            "young teenage face, smooth complexion, short black hair, simple white dhoti and "
            "kurta, fearless kind smile. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "surya-sen": {
        "monument": "jallianwala",
        "portrait_prompt": (
            "An illustrated portrait of Surya Sen 'Master-da', Bengali revolutionary teacher, "
            "wearing round wire glasses, thin moustache, simple white kurta, wise kind face, "
            "neatly combed hair. Children's storybook watercolor cartoon style. Head-and-"
            "shoulders. Plain off-white parchment background."
        ),
    },
    "bagha-jatin": {
        "monument": "jallianwala",
        "portrait_prompt": (
            "An illustrated portrait of Jatindranath Mukherjee 'Bagha Jatin', strong Bengali "
            "freedom fighter, broad muscular shoulders, thick moustache, neatly combed hair, "
            "wearing a simple cotton kurta. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "matangini-hazra": {
        "monument": "jallianwala",
        "portrait_prompt": (
            "An illustrated portrait of Matangini Hazra, brave elderly Bengali woman of 73, deep "
            "wrinkles, white hair tied in a bun, wearing a plain white widow's sari with red "
            "border, holding a tiny Indian tricolor flag, kind fierce eyes. Children's storybook "
            "watercolor cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "bipin-pal": {
        "monument": "jallianwala",
        "portrait_prompt": (
            "An illustrated portrait of Bipin Chandra Pal, Bengali nationalist orator, neatly "
            "combed hair, grey beard, wearing a simple white kurta with a black coat over it, "
            "thoughtful intelligent eyes. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    # ---------- West / Maharashtra / Parsi ----------
    "veer-savarkar": {
        "monument": "gateway_india",
        "portrait_prompt": (
            "An illustrated portrait of Vinayak Damodar Savarkar, Marathi revolutionary writer, "
            "round face, hair neatly combed back, thick moustache, wearing a black coat over a "
            "white kurta, serious intense eyes. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "madam-cama": {
        "monument": "gateway_india",
        "portrait_prompt": (
            "An illustrated portrait of Madam Bhikaji Cama, elegant Parsi Indian freedom fighter, "
            "wearing a green sari with a gold border, hair pulled back neatly, holding a small "
            "Indian flag from 1907, dignified kind smile. Children's storybook watercolor cartoon "
            "style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "tantia-tope": {
        "monument": "jhansi_fort",
        "portrait_prompt": (
            "An illustrated portrait of Tantia Tope, lightning-fast Maratha guerrilla general, "
            "white turban-style headwrap, thick handlebar moustache, simple kurta with bandolier, "
            "brave confident smile. Children's storybook watercolor cartoon style. Head-and-"
            "shoulders. Plain off-white parchment background."
        ),
    },
    # ---------- South ----------
    "subramania-bharati": {
        "monument": "charminar",
        "portrait_prompt": (
            "An illustrated portrait of Subramania Bharati, Tamil poet and freedom fighter, "
            "long upturned bushy moustache, large white turban, simple white shawl, kind dreamy "
            "eyes, holding a small notebook of poems. Children's storybook watercolor cartoon "
            "style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "alluri-sitarama-raju": {
        "monument": "charminar",
        "portrait_prompt": (
            "An illustrated portrait of Alluri Sitarama Raju, young Telugu tribal warrior, long "
            "black hair, beard, wearing simple tribal clothes with a saffron sash, bow and arrow "
            "in hand, brave kind face. Children's storybook watercolor cartoon style. Head-and-"
            "shoulders. Plain off-white parchment background."
        ),
    },
    "velu-thampi": {
        "monument": "charminar",
        "portrait_prompt": (
            "An illustrated portrait of Velu Thampi Dalawa, brave 19th-century Travancore prime "
            "minister, traditional Kerala headwrap, gold-trimmed white mundu draped, thick "
            "moustache, kind royal eyes. Children's storybook watercolor cartoon style. Head-and-"
            "shoulders. Plain off-white parchment background."
        ),
    },
    # ---------- Women warrior queens ----------
    "begum-hazrat-mahal": {
        "monument": "red_fort",
        "portrait_prompt": (
            "An illustrated portrait of Begum Hazrat Mahal, brave Muslim queen-regent of Awadh, "
            "wearing a deep red and gold royal Mughal-style outfit with jewelry, white headscarf "
            "trimmed with gold, dignified kind face. Children's storybook watercolor cartoon "
            "style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "kittur-chennamma": {
        "monument": "jhansi_fort",
        "portrait_prompt": (
            "An illustrated portrait of Rani Kittur Chennamma, brave Kannada warrior queen of "
            "1820s, wearing a green and gold Karnataka-style sari, traditional Kannada "
            "jewellery, holding a small sword, hair tied with flowers, fierce kind eyes. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white "
            "parchment background."
        ),
    },
    "aruna-asaf-ali": {
        "monument": "india_gate",
        "portrait_prompt": (
            "An illustrated portrait of Aruna Asaf Ali, brave Indian woman of 1942, short wavy "
            "hair, wearing a simple white khadi sari with a black border, holding a small Indian "
            "tricolor flag, fierce kind smile. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "kalpana-datta": {
        "monument": "jallianwala",
        "portrait_prompt": (
            "An illustrated portrait of Kalpana Datta, young Bengali revolutionary girl, short "
            "hair dressed as a boy, wearing a white kurta with a brown waistcoat, brave defiant "
            "smile, small spectacles. Children's storybook watercolor cartoon style. Head-and-"
            "shoulders. Plain off-white parchment background."
        ),
    },
    # ---------- Tribal ----------
    "birsa-munda": {
        "monument": "ashoka_pillar",
        "portrait_prompt": (
            "An illustrated portrait of Birsa Munda 'Dharti Aaba', young Munda tribal hero of "
            "Jharkhand, long black hair, headband with feathers, bare-chested with tribal beads, "
            "holding a bow, kind dignified eyes. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "tilka-manjhi": {
        "monument": "ashoka_pillar",
        "portrait_prompt": (
            "An illustrated portrait of Tilka Manjhi, brave Santhal tribal warrior of 1700s, "
            "long black hair, tribal headband, bare-chested with traditional Santhal beads, "
            "holding a bow and arrow, fierce kind face. Children's storybook watercolor cartoon "
            "style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },

    # ---------- 16 additional heroes (added with stories_seed_extra) ----------
    "ram-prasad-bismil": {
        "monument": "ashoka_pillar",
        "portrait_prompt": (
            "A warm illustrated portrait of Ram Prasad Bismil, young Indian revolutionary poet from the 1920s, "
            "neat short hair, thin moustache, kind determined eyes, wearing simple white kurta with shawl, "
            "holding a small notebook of poems. Children's storybook watercolor cartoon style. Head-and-shoulders. "
            "Plain off-white parchment background. Subtle tricolor halo."
        ),
    },
    "ashfaqulla-khan": {
        "monument": "ashoka_pillar",
        "portrait_prompt": (
            "A warm illustrated portrait of Ashfaqullah Khan, young 1920s Indian Muslim freedom fighter, "
            "wearing a small white cap, kind smiling face, light beard, simple sherwani, gentle eyes. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "kunwar-singh": {
        "monument": "jhansi_fort",
        "portrait_prompt": (
            "A warm illustrated portrait of Veer Kunwar Singh of Bihar, brave 80-year-old Indian warrior king of 1857, "
            "long white beard, large turban with feather, ornate royal robe, sword at side, fierce wise eyes. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "tara-rani-srivastava": {
        "monument": "india_gate",
        "portrait_prompt": (
            "A warm illustrated portrait of Tara Rani Srivastava, brave young Indian woman freedom fighter of 1942, "
            "wearing a simple white khadi sari with red border, hair in a low bun, calm determined face, "
            "holding the Indian tricolor flag. Children's storybook watercolor cartoon style. Head-and-shoulders. "
            "Plain off-white parchment background."
        ),
    },
    "aurobindo-ghosh": {
        "monument": "ashoka_pillar",
        "portrait_prompt": (
            "A warm illustrated portrait of Sri Aurobindo Ghosh, Indian yogi-revolutionary, long flowing white hair "
            "and white beard, deep peaceful eyes, simple white robe, meditative expression. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "veer-surendra-sai": {
        "monument": "jhansi_fort",
        "portrait_prompt": (
            "A warm illustrated portrait of Veer Surendra Sai, Odisha warrior prince of the 1800s, "
            "long thick black moustache, turban with feather, royal tribal robes, sword in hand, fierce kind eyes. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "bhima-bhoi": {
        "monument": "ashoka_pillar",
        "portrait_prompt": (
            "A warm illustrated portrait of Bhima Bhoi, blind tribal poet-philosopher of Odisha, "
            "closed peaceful eyes, gentle smile, long beard, simple saffron robe, lotus garland, "
            "wise calm face. Children's storybook watercolor cartoon style. Head-and-shoulders. "
            "Plain off-white parchment background."
        ),
    },
    "uyyalawada-narasimha-reddy": {
        "monument": "charminar",
        "portrait_prompt": (
            "A warm illustrated portrait of Uyyalawada Narasimha Reddy, Andhra Pradesh chieftain of the 1840s, "
            "thick black moustache, large turban, royal silk robes, sword and shield, brave determined eyes. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "abbakka-chowta": {
        "monument": "gateway_india",
        "portrait_prompt": (
            "A warm illustrated portrait of Rani Abbakka Chowta, 16th-century warrior queen of Ullal Karnataka, "
            "elegant traditional South Indian queenly attire with gold jewellery, long hair tied with flowers, "
            "holding a sword, fierce kind face, ocean breeze. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "pazhassi-raja": {
        "monument": "gateway_india",
        "portrait_prompt": (
            "A warm illustrated portrait of Pazhassi Raja of Kerala, late-1700s warrior king of Wayanad, "
            "broad moustache, traditional Kerala mundu and gold-bordered shawl, ornate turban, "
            "fierce brave eyes, holding a sword. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "kattabomman": {
        "monument": "charminar",
        "portrait_prompt": (
            "A warm illustrated portrait of Veerapandiya Kattabomman, late-1700s Tamil chieftain, "
            "tall figure, large twisted black moustache, ornate turban with jewel, traditional South Indian "
            "warrior robes with red sash, sword in hand, defiant brave face. Children's storybook watercolor "
            "cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "puli-thevar": {
        "monument": "charminar",
        "portrait_prompt": (
            "A warm illustrated portrait of Puli Thevar, mid-1700s Tamil warrior chieftain, "
            "fierce eyes, big moustache, simple cotton turban, traditional Tamil warrior attire with sword, "
            "tiger-like determined expression. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "kanaklata-barua": {
        "monument": "india_gate",
        "portrait_prompt": (
            "A warm illustrated portrait of Kanaklata Barua, brave 17-year-old Assamese girl of 1942, "
            "wearing the traditional Assamese mekhela chador (white with red border), simple braided hair, "
            "bright determined kind eyes, holding the Indian tricolor flag. Children's storybook watercolor "
            "cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "kushal-konwar": {
        "monument": "india_gate",
        "portrait_prompt": (
            "A warm illustrated portrait of Kushal Konwar, gentle Assamese schoolteacher and freedom fighter of 1940s, "
            "kind calm eyes, neat hair, traditional Assamese white khadi attire with shawl, soft smile. "
            "Children's storybook watercolor cartoon style. Head-and-shoulders. Plain off-white parchment background."
        ),
    },
    "tirot-sing": {
        "monument": "jhansi_fort",
        "portrait_prompt": (
            "A warm illustrated portrait of U Tirot Sing, early-1800s Khasi tribal chief from Meghalaya, "
            "wearing traditional Khasi attire with feathered headgear, long earrings, dignified strong face, "
            "holding a traditional sword. Children's storybook watercolor cartoon style. Head-and-shoulders. "
            "Plain off-white parchment background."
        ),
    },
    "rani-gaidinliu": {
        "monument": "india_gate",
        "portrait_prompt": (
            "A warm illustrated portrait of Rani Gaidinliu, brave young Naga woman freedom fighter, "
            "wearing traditional Naga tribal dress with red, black and white woven stripes, beaded necklace, "
            "feathered headgear, fierce kind eyes. Children's storybook watercolor cartoon style. "
            "Head-and-shoulders. Plain off-white parchment background."
        ),
    },
}
