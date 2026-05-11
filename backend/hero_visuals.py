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
}
