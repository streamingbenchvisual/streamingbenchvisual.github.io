document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const questionPopup = document.getElementById('question-popup');
    const questionText = document.getElementById('question-text');
    const pageNumber = document.getElementById('page-number');
    const playPauseBtn = document.getElementById('play-pause');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const markersContainer = document.getElementById('markers');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const progressHandle = document.getElementById('progress-handle');
    const videoSidebar = document.querySelector('.video-sidebar');
    const videoContainer = document.querySelector('.video-container');
    const filterTags = document.querySelectorAll('.filter-tag');
    const modelTags = document.querySelectorAll('.model-tag');
    const videoThumbnailsContainer = document.getElementById('video-thumbnails');
    const categoryHeaders = document.querySelectorAll('.category-header');

    let currentVideoIndex = 0;
    let isDragging = false;
    let autoPauseTimeout = null;
    let shownQuestions = new Set();
    let filteredVideos = [];
    const videoList = [
        {
            src: 'videos/video1.mp4',
            thumbnail: 'thumbnails/video1.jpg',
            title: 'Video 1',
            attributes: ['Object Perception','Causal Reasoning','Text-Rich Understanding','Attribute Perception'],
            questions: [
                { 
                    time: 4, 
                    text: 'What logos are visible in the background as players and referees walk towards the center of the football field?',
                    taskType: 'Object Perception',
                    options: [
                        'A. FIFA and La Liga.',
                        'B. UEFA and La Liga.',
                        'C. Bundesliga and La Liga.',
                        'D. Aeromexico and La Liga.'
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'GPT-4o': "D",
                        'Claude 3.5 sonnet': "D",
                        'Gemini 1.5pro': "D",
                        'LLaVA-OneVision': "D",
                        'MiniCPM-V 2.6': "D",
                        "Flash-VStream": "A. FIFA and Premier League.",
                        "InternVL-V2-8": "D. Aeromexico and La Liga.",
                        "LLaVA-Next-Video-32B": "D",
                        "LLaVA-OneVision": "D",
                        "LongVA": "D",
                        "Qwen2-VL": "D",
                        "VideoCCam": "D. Aeromexico and La Liga.",
                    }
                },
                { 
                    time: 53, 
                    text: 'Why does the player wearing the number nine red and blue jersey celebrate?',
                    taskType: 'Causal Reasoning',
                    options: [
                        'A. He saved a goal.',
                        'B. He received a pass.',
                        'C. He scored a goal.',
                        'D. He won a free kick.'
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'GPT-4o': "C",
                        'Claude 3.5 sonnet': "C",
                        'Gemini 1.5pro': "C",
                        'LLaVA-OneVision': "C",
                        'MiniCPM-V 2.6': "C",
                        "InternVL-V2-8": "C. He scored a goal.",
                        "Kangaroo": "C",
                        "LLaVA-OneVision": "C",
                        "LongVA": "C",
                        "VideoCCam": "C. He scored a goal.",
                        "VideoLLaMA2": "C. He scored a goal. "
                    }
                },
                { 
                    time: 81, 
                    text: 'What logo is seen on the jersey of the player covering his mouth?',
                    taskType: 'Text-Rich Understanding',
                    options: [
                        'A. Apple.',
                        'B. Google.',
                        'C. Adidas.',
                        'D. Spotify.'
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'GPT-4o': "D",
                        'Claude 3.5 sonnet': "D",
                        'Gemini 1.5pro': "D",
                        "VideoCCam": "D. Spotify.",
                        "MiniCPM-V": "D",
                        "Qwen2-VL": "D",
                        "LongVA": "D",
                        "LLaVA-OneVision": "D",
                        "Flash-VStream": "A. Apple.",
                        "LLaVA-Next-Video-32B": "D"
                    }
                },
                { 
                    time: 80, 
                    text: 'What color is the goalie\'s uniform?',
                    taskType: 'Attribute Perception',
                    options: [
                        'A. Blue.',
                        'B. Red.',
                        'C. White.',
                        'D. Yellow.'
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'GPT-4o': "D",
                        'Claude 3.5 sonnet': "D",
                        'Gemini 1.5pro': "D",
                        "LLaVA-Next-Video-32B": "D",
                        "VideoCCam": "D. Yellow.",
                        "MiniCPM-V": "D",
                        "Qwen2-VL": "D",
                        "LongVA": "D",
                        "LLaVA-OneVision": "D",
                        "Flash-VStream": "A. Blue."
                    }
                },
                { 
                    time: 128, 
                    text: 'What is the color of the cooler labeled "PRIME" near the team bench?',
                    taskType: 'Attribute Perception',
                    options: [
                        'A. Blue.',
                        'B. Yellow.',
                        'C. Green.',
                        'D. Red.'
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'GPT-4o': "D",
                        'Claude 3.5 sonnet': "D",
                        'Gemini 1.5pro': "D",
                        'LLaVA-OneVision': "D",
                        'MiniCPM-V 2.6': "D",
                        "LLaVA-Next-Video-32B": "D",
                        "VideoCCam": "D. Red.",
                        "MiniCPM-V": "D",
                        "Qwen2-VL": "D",
                        "LongVA": "D",
                        "LLaVA-OneVision": "D",
                        "Flash-VStream": "A. Blue."
                    }
                }
            ]
        },
        {
            src: 'videos/Anomaly Context Understanding/video.mp4',
            thumbnail: 'videos/Anomaly Context Understanding/video.jpg',
            title: 'Video 2',
            attributes: ['Anomaly Context Understanding'],
            questions: [
                {
                    time: 22, 
                    text: 'What unusual event just occurred?',
                    taskType: 'Anomaly Recognition',
                    options: [
                        'A. The little boy turned his body to the left, turned his head down, bent slightly, released his right hand and threw it into the air. The white handkerchief flew around once, hit the young boy, and then the young boy suddenly disappeared.',
                        'B. The little boy raised his hands to his waist and put a white handkerchief into his right hand with his left hand.',
                        'C. The little boy turned his body to the left, turned his head down, bent slightly, released his right hand and threw it into the air. The red handkerchief in his right hand disappeared.',
                        'D. The little boy raised his clenched right hand, faced straight ahead, and spoke with a serious expression.'
                    ],
                    correctOption: 'A',
                    modelReplies: {
                        'GPT-4o': "A",
                        'Claude 3.5 sonnet': "A",
                        'Gemini 1.5pro': "A",
                        'LLaVA-OneVision': "A",
                        'MiniCPM-V 2.6': "A",
                    }
                },
                {
                    time: 99, 
                    text: 'What unusual event just occurred?',
                    taskType: 'Anomaly Recognition',
                    options: [
                        'A. The little boy turned his body to the left, turned his head down, bent slightly, released his right hand and threw it into the air. The white handkerchief in his right hand disappeared.',
                        'B. The little boy reached for the bottom of the paper cup with his right hand and pulled it down. The whole white paper cup turned into a long string of strips.',
                        'C. The red playing card with a hole in the little boy\'s left hand became a round black card.',
                        'D. The little boy reached for the bottom of the paper cup with his left hand and pulled it down. The whole white paper cup turned into a long string of strips.'
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'GPT-4o': "D",
                        'Claude 3.5 sonnet': "B",
                        'Gemini 1.5pro': "D",
                        'LLaVA-OneVision': "D",
                        'MiniCPM-V 2.6': "D",
                    }
                },
                {
                    time: 139, 
                    text: 'What unusual event just occurred?',
                    taskType: 'Anomaly Recognition',
                    options: [
                        'A. The little boy unscrewed a white bulb from the lamp and milk poured out of the bulb.',
                        'B. The little boy turned his body to the left, turned his head down, bent slightly, released his right hand and threw it into the air. The white handkerchief in his right hand disappeared.',
                        'C. The little boy unscrewed a black bulb from the lamp, and the coke poured out of the bulb.',
                        'D. The little boy reached for the bottom of the paper cup with his left hand and pulled it down. The whole white paper cup turned into a long string of strips.'
                    ],
                    correctOption: 'A',
                    modelReplies: {
                        'GPT-4o': "A",
                        'Claude 3.5 sonnet': "D",
                        'Gemini 1.5pro': "A",
                        'LLaVA-OneVision': "A",
                        'MiniCPM-V 2.6': "A",
                    }
                },
                {
                    time: 230, 
                    text: 'What unusual event just occurred?',
                    taskType: 'Anomaly Recognition',
                    options: [
                        'A. The female guest unscrews the candy jar according to what the little boy said, and the number 2000 she casually said appears on the slip of paper inside the candy jar.',
                        'B. The male guest unscrews the candy jar according to what the little boy said, and the number 2500 he casually said appears on the slip of paper inside the candy jar.',
                        'C. The little boy unscrewed a white bulb from the lamp and milk poured out of the bulb.',
                        'D. The little boy turned his body to the left, turned his head down, bent slightly, released his right hand and threw it into the air. The white handkerchief in his right hand disappeared.'
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'GPT-4o': "B",
                        'Claude 3.5 sonnet': "C",
                        'Gemini 1.5pro': "B",
                        'LLaVA-OneVision': "B",
                        'MiniCPM-V 2.6': "B",
                    }
                },
                {
                    time: 279, 
                    text: 'What unusual event just occurred?',
                    taskType: 'Anomaly Recognition',
                    options: [
                        'A. The little boy unscrewed a white bulb from the lamp and milk poured out of the bulb.',
                        'B. The little boy reached for the bottom of the paper cup with his left hand and pulled it down. The whole white paper cup turned into a long string of strips.',
                        'C. The male guest randomly selected a playing card and said the number, a few seconds later, he opened the playing card in his hand, there appeared the seven of diamonds just said.',
                        'D. The female guest randomly selected a playing card and said the number, a few seconds later, he turned over the playing card in his hand, and there appeared the eight of diamonds just said.'
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'GPT-4o': "C",
                        'Claude 3.5 sonnet': "A",
                        'Gemini 1.5pro': "C",
                        'LLaVA-OneVision': "C",
                        'MiniCPM-V 2.6': "C",
                    }
                }
            ]
        },
        {
            src: 'videos/Misleading Context Understanding/video.mp4',
            thumbnail: 'videos/Misleading Context Understanding/video.jpg',
            title: 'Video 3',
            attributes: ['Misleading Context Understanding'],
            questions: [
                {
                    time: 33, 
                    text: 'How many cards and how many suits are on the table now?',
                    taskType: 'Misleading Context Understanding',
                    options: [
                        'A. There are three pink cards and one playing card, the playing card is Diamond 2.',
                        'B. There are three pink cards and one playing card, the playing card is Diamond 3.',
                        'C. There are three pink cards and two playing cards, Diamond 3 and Diamond 2 respectively.',
                        'D. There are four pink cards.'
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A"
                    }
                },
                {
                    time: 52, 
                    text: 'How many cards and suits are there on the table now?',
                    taskType: 'Misleading Context Understanding',
                    options: [
                        'A. There is a pile of pink cards being dealt up and down',
                        'B. There are three pink playing cards',
                        'C. There are three pink cards and one playing card, the playing card is a diamond 3',
                        'D. There are three pink cards and two playing cards, one diamond 3 and one red heart 3.'
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "D"
                    }
                },
                {
                    time: 70, 
                    text: 'What\'s on the table now?',
                    taskType: 'Misleading Context Understanding',
                    options: [
                        'A. There are five playing cards, the 3 of diamonds, the 4 of clubs, the 5 of hearts, the 6 of spades, and the 7 of diamonds, and the text below reads: straight.',
                        'B. There are five playing cards, the 3 of diamonds, the 4 of clubs, the 5 of hearts, the 6 of spades, and the 7 of diamonds, and the text below reads: five card groups.',
                        'C. there are five playing cards, the 4 of hearts, the 4 of spades, the 5 of spades, the 5 of diamonds, and the 5 of clubs.',
                        'D. there are two playing cards, a four of hearts and a four of spades.'
                    ],
                    correctOption: 'A',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A"
                    }
                },
                {
                    time: 88, 
                    text: 'How many cards, and of how many suits, are currently on the table?',
                    taskType: 'Misleading Context Understanding',
                    options: [
                        'A. There are five playing cards, the 8 of diamonds, the 8 of clubs, the 8 of hearts, the 8 of spades, and the jack of diamonds.',
                        'B. There are five playing cards, the 4 of diamonds, the 6 of diamonds, the 8 of diamonds, the 2 of diamonds, and the Q of diamonds.',
                        'C. There are five playing cards, the nine of spades, the ten of spades, the jack of spades, the queen of spades, and the king of spades.',
                        'D. There are five playing cards, the 10 of hearts, the 10 of diamonds, the 10 of clubs, the 9 of diamonds, and the 9 of clubs.'
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 150, 
                    text: 'How many cards and how many suits are on the table now?',
                    taskType: 'Misleading Context Understanding',
                    options: [
                        'A. There is one playing card, the 4 of spades.',
                        'B. There are two playing cards, the 4 of diamonds and the 4 of hearts.',
                        'C. There are three playing cards, the 3 of Spades, the 3 of Hearts, and the 3 of Clubs.',
                        'D. There are five playing cards, the 4 of hearts, the 5 of clubs, the 6 of diamonds, the 7 of clubs, and the 8 of hearts.'
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A"
                    }
                }
            ]
        },
        {
            src: 'videos/Proactive Output/video.mp4',
            thumbnail: 'videos/Proactive Output/video.jpg',
            title: 'Video 4',
            attributes: ['Proactive Output'],
            questions: [
                {
                    time: 26, 
                    text: 'When the number 20 appears in the middle of the sun in the video, output "20".',
                    taskType: 'Proactive Output',
                    correctOption: '62',
                    groundTruthOutput: '20',
                    modelReplies: {
                        'InternVL-V2': '[00:00:25]: 20',
                        "LLaVA-OneVision": '[00:00:36]: 20',
                        "LongVA": "[00:00:25]: 20"
                    }
                },
                {
                    time: 80, 
                    text: 'When the number 20 in red appears in the video, output "20".',
                    taskType: 'Proactive Output',
                    correctOption: '124',
                    groundTruthOutput: '20',
                    modelReplies: {
                        'InternVL-V2-8': '[00:01:20]: 20',
                        "LLaVA-OneVision: '[00:01:20]: 20'",
                        "LongVA": "[00:01:20]: 20"
                    }
                },
                {
                    time: 176, 
                    text: 'When 7 potatoes appear in the video, output "7".',
                    taskType: 'Proactive Output',
                    correctOption: '182',
                    ground_truth_output: "7",
                    modelReplies: {
                        'InternVL-V2': '[00:02:56]: 7',
                        "LLaVA-OneVision": '[00:02:56]: 7',
                        "LongVA": "[00:02:56]: 7"
                    }
                },
                {
                    time: 407, 
                    text: 'When there are only 5 teddy bears left on the bed, output "5".',
                    taskType: 'Proactive Output',
                    correctOption: '430',
                    ground_truth_output: "5",
                    modelReplies: {
                        'InternVL-V2': '[00:06:47]: 5',
                        "LLaVA-OneVision": '[00:06:47]: 5',
                        "LongVA": "[00:06:47]: 5"
                    }
                },
                {
                    time: 645, 
                    text: 'When a total of 5 cartoon characters wearing hats have appeared in the video, output "5".',
                    taskType: 'Proactive Output',
                    correctOption: '652',
                    ground_truth_output: "5",
                    modelReplies: {
                        'InternVL-V2': '[00:10:45]: 5',
                        "LLaVA-OneVision": '[00:10:45]: 5',
                        "LongVA": "[00:10:45]: 5"
                    }
                }
            ]
        },
        {
            src: 'videos/Sequential Question Answering/video.mp4',
            thumbnail: 'videos/Sequential Question Answering/video.jpg',
            title: 'Video 5',
            attributes: ['Sequential Question Answering'],
            questions: [
                {
                    time: 9, 
                    text: 'What is the person in the center of the video wearing?',
                    taskType: 'Sequential Question Answering',
                    options: [
                        'A. A black jacket over a white shirt.',
                        'B. A navy blue jacket over a gray shirt.',
                        'C. A dark brown jacket over a white shirt.',
                        'D. A black sweater over a white t-shirt.'
                    ],
                    correctOption: 'A',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A",
                        "Flash-VStream": "A",
                        "InternVL-V2-8": "A. A black jacket over a white shirt.",
                        "Kangaroo": "A. A black jacket over a white shirt.",
                        "LLaVA-Next-Video-32B": "A",
                        "LLaVA-OneVision": "A",
                        "MiniCPM-V": "A",
                        "Qwen2-VL": "B"
                    }
                },
                {
                    time: 26, 
                    text: 'Who is the person mentioned in the previous question interacting with right now?',
                    taskType: 'Sequential Question Answering',
                    options: [
                        'A. A bald man wearing round glasses and a light-colored blazer over a dark shirt.',
                        'B. A woman with long blonde hair wearing a dark-colored top.',
                        'C. A man with short dark hair and wear a dark-colored shirt.',
                        'D. A woman with long blonde hair wearing a strapless, patterned dress.'
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C",
                        "Flash-VStream": "A",
                        "InternVL-V2-8": "A",
                        "Kangaroo": "D. A woman with long blonde hair wearing a strapless, patterned dress",
                        "LLaVA-Next-Video-32B": "C",
                        "LLaVA-OneVision": "A",
                        "MiniCPM-V": "A",
                        "Qwen2-VL": "A"
                    }
                },
                {
                    time: 273, 
                    text: 'What actions did the two individuals mentioned in the previous question just take?',
                    taskType: 'Sequential Question Answering',
                    options: [
                        'A. They exchanged a nod.',
                        'B. They bumped fists.',
                        'C. They shook hands.',
                        'D. They gave each other a high-five.'
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C",
                        "Flash-VStream": "A",
                        "InternVL-V2-8": "C. They shook hands.",
                        "Kangaroo": "C. They shook hands.",
                        "LLaVA-Next-Video-32B": "B",
                        "LLaVA-OneVision": "C",
                        "MiniCPM-V": "C. They shook hands.",
                        "Qwen2-VL": "B"
                    }
                },
                {
                    time: 332, 
                    text: 'What is the current outfit of the man mentioned in the first question?',
                    taskType: 'Sequential Question Answering',
                    options: [
                        'A. A light-colored shirt and dark-colored pants.',
                        'B. A dark-colored shirt and light-colored pants',
                        'C. A dark-colored jacket and jeans.',
                        'D. A light-colored sweater and khaki shorts.'
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C",
                        "Flash-VStream": "A",
                        "InternVL-V2-8": "A",
                        "Kangaroo": "A. A black jacket over a white shirt.",
                        "LLaVA-Next-Video-32B": "A",
                        "LLaVA-OneVision": "A",
                        "MiniCPM-V": "B",
                        "Qwen2-VL": "A"
                    }
                },
                {
                    time: 546, 
                    text: 'What is the person mentioned in the previous question holding in their hand right now?',
                    taskType: 'Sequential Question Answering',
                    options: [
                        'A. A black picture frame with white edges, containing three playing cards.',
                        'B. A white picture frame with silver edges, containing five playing cards.',
                        'C. A white picture frame with black edges, containing four playing cards.',
                        'D. A wooden picture frame with gold edges, containing four photographs.'
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'Claude 3.5 sonnet': "D",
                        "Flash-VStream": "A",
                        "InternVL-V2-8": "C",
                        "Kangaroo": "C. A white picture frame with black edges, containing four playing cards.",
                        "LLaVA-Next-Video-32B": "C",
                        "LLaVA-OneVision": "C",
                        "MiniCPM-V": "C",
                        "Qwen2-VL": "C"
                    }
                }
            ]
        },
        {
            src: 'videos/Source Discrimination/video.mp4',
            thumbnail: 'videos/Source Discrimination/video.jpg',
            title: 'Video 6',
            attributes: ['Source Discrimination'],
            questions: [
                {
                    time: 57, 
                    text: "Who just said 'Oh my God.'?",
                    taskType: 'Source Discrimination',
                    options: [
                        "A. A brown-haired male wearing a dark green blazer with a white shirt, black vest, blue tie and black pants.",
                        "B. a brown-haired man wearing a black blazer with a white turtleneck and black pants.",
                        "C. a brunette female wearing a black, deep V-neck dress and a necklace with gold stones.",
                        "D. a brunette female wearing a pink blouse and black pants with a black belt with a silver square buckle and multiple necklaces."
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "D",
                        "InternVL-V2-8": "D. A brown-haired female wearing a black short-sleeved T-shirt with gray stripes around the collar and cuffs, and black-and-white striped pants."
                    }
                },
                {
                    time: 80, 
                    text: "Who just said 'Good for you.'?",
                    taskType: 'Source Discrimination',
                    options: [
                        "A. A brown-haired male wearing a dark green blazer with a white shirt, black vest, blue tie and black pants.",
                        "B. a brown-haired man wearing a black blazer with a white turtleneck and black pants.",
                        "C. a brunette female wearing a black, deep V-neck dress and a necklace with gold stones.",
                        "D. a brunette female wearing a pink blouse and black pants with a black belt with a silver square buckle and multiple necklaces."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C",
                        "InternVL-V2-8": "A"
                    }
                },
                {
                    time: 154, 
                    text: "Who just said 'You're right, l'm sorry.'?",
                    taskType: 'Source Discrimination',
                    options: [
                        "A. A brown-haired male wearing a dark green blazer with a white shirt, black vest, blue tie and black pants.",
                        "B. a brown-haired man wearing a black blazer with a white turtleneck and black pants.",
                        "C. a brunette female wearing a black, deep V-neck dress and a necklace with gold stones.",
                        "D. a brunette female wearing a pink blouse and black pants with a black belt with a silver square buckle and multiple necklaces."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B",
                        "InternVL-V2-8": "C. a dark-haired male wearing a blue, black, and white striped bathrobe."
                    }
                },
                {
                    time: 160, 
                    text: "Who just said 'Can we have three chocolate mousses to go, please?'?",
                    taskType: 'Source Discrimination',
                    options: [
                        "A. A brown-haired male wearing a dark green blazer with a white shirt, black vest, blue tie and black pants.",
                        "B. a brown-haired man wearing a black blazer with a white turtleneck and black pants.",
                        "C. a brunette female wearing a black, deep V-neck dress and a necklace with gold stones.",
                        "D. a brunette female wearing a pink blouse and black pants with a black belt with a silver square buckle and multiple necklaces."
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B",
                        "InternVL-V2-8": "B. A brunette wearing a black short-sleeved t-shirt with gray stripes around the collar and cuffs, and black-and-white striped pants."
                    }
                },
                {
                    time: 216, 
                    text: "Who just said 'a stupid man who left us his credit card'?",
                    taskType: 'Source Discrimination',
                    options: [
                        "A. a brown-haired man wearing a black blazer with a white turtleneck and black pants.",
                        "B. a brunette female wearing a black, deep V-neck dress and a necklace with gold stones.",
                        "C. a brunette female wearing a pink blouse and black pants with a black belt with a silver square buckle and multiple necklaces.",
                        "D. A brown-haired male wearing a dark green blazer with a white shirt, black vest, blue tie and black pants."
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C"
                    }
                }
            ]
        },
        {
            src: 'videos/Scene Understanding/video.mp4',
            thumbnail: 'videos/Scene Understanding/video.jpg',
            title: 'Video 7',
            attributes: ['Scene Understanding'],
            questions: [
                {
                    time: 119, 
                    text: "Please describe the scene that just occurred in the video?",
                    taskType: 'Scene Understanding',
                    options: [
                        "A. A player in a light blue shirt and a player in a red shirt collided in a fight for the soccer ball, in which the player in the light blue shirt kicked the ball, after which both players fell on the field, and the narrator said 'Vardyol came upon it and was surely brought down penalty.'.",
                        "B. A player in a light blue jersey is taking a penalty, he shoots to the left of the goal, the keeper in a yellow jersey dives to the right and the ball goes in, after which the commentator says 'Harland scores very very comfortably.'.",
                        "C. A player in a light blue jersey headed a ball from a teammate towards the goal, but it was caught by the goalkeeper in a yellow jersey, and the narrator shouted 'Harland's header, great save.'.",
                        "D. A player in a red jersey headed a ball from a teammate towards the goal, but it was caught by the goalkeeper in a yellow jersey, and the narrator shouted 'Harland's header, great save.'."
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 182, 
                    text: "Please describe the scene that just occurred in the video?",
                    taskType: 'Scene Understanding',
                    options: [
                        "A. A player in a light blue jersey jumps onto the shoulders of a player in a green jersey, and using the shoulders of the player in the red jersey to support himself, he puts the ball into the goal, and the narrator says 'Harland at the far, two nil.'.",
                        "B. A player in a light blue jersey is taking a penalty, he shoots to the left of the goal, the keeper in a yellow jersey dives to the right and the ball goes in, after which the commentator says 'Harland scores very very comfortably.'.",
                        "C. A player in a light blue jersey headed a ball from a teammate towards the goal, but it was caught by the goalkeeper in a yellow jersey, and the narrator shouted 'Harland's header, great save.'.",
                        "D. A player in a light blue jersey jumps onto the shoulders of a player in a red jersey, and using the shoulders of the red jersey player to support himself, he puts the ball into the goal, and the narrator says 'Harland at the far, two nil.'."
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "D"
                    }
                },
                {
                    time: 242, 
                    text: "Please describe the scene that just occurred in the video?",
                    taskType: 'Scene Understanding',
                    options: [
                        "A. A player in a light blue uniform dribbles toward the goal, a player in a red uniform chases after the player in light blue, and finally the two men fall in a scramble, and the narrator says, 'Chance for a hat-trick, oh that's surely a penalty.'.",
                        "B. A player in a red uniform dribbles toward the goal, a player in a light blue uniform chases the player in a light blue uniform, and finally the two men fall in a scramble, and the narrator says, 'Chance for a hat-trick, oh that's surely a penalty.'.",
                        "C. A player in a light blue jersey headed a ball from a teammate towards the goal, but it was caught by the goalkeeper in a yellow jersey, and the narrator shouted 'Harland's header, great save.'.",
                        "D. A player in a light blue jersey jumps onto the shoulders of a player in a red jersey, and using the shoulders of the red jersey player to support himself, he puts the ball into the goal, and the narrator says 'Harland at the far.'."
                    ],
                    correctOption: 'A',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A"
                    }
                },
                {
                    time: 331, 
                    text: "Please describe the scene that just occurred in the video?",
                    taskType: 'Scene Understanding',
                    options: [
                        "A. A player in a light blue uniform dribbles toward the goal, a player in a red uniform chases after the player in light blue, and finally the two men fall in a scramble, and the narrator says, 'Chance for a hat-trick, oh that's surely a penalty.'.",
                        "B. A player in a light blue jersey took a shot that was parried by a player in a yellow jersey, another player in a light blue jersey and a player in a red jersey fought for the parried ball and the player in the red jersey kicked the ball right out of the field, and the narrator said, 'Finds Foden and Foden's shot was going into the corner.'.",
                        "C. A player in a red jersey took a shot that was pounced on by a player in a yellow jersey, another player in a light blue jersey and a player in a red jersey fought for the pounced ball and the player in the red jersey kicked the ball right out of the field, the narrator said 'finds Foden and Foden's shot was going into the corner and Jose Saar parried it away.'.",
                        "D. A player in a light blue jersey jumps onto the shoulders of a player in a red jersey, and using the shoulders of the red jersey player to support himself, he puts the ball into the goal, and the narrator says 'Harland at the far.'."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 412, 
                    text: "Please describe the scene that just occurred in the video?",
                    taskType: 'Scene Understanding',
                    options: [
                        "A. A player in a light blue uniform dribbles toward the goal, a player in a red uniform chases after the player in light blue, and finally the two men fall in a scramble, and the narrator says, 'Chance for a hat-trick, oh that's surely a penalty.'.",
                        "B. A player in a light blue jersey took a shot that was parried by a player in a yellow jersey, another player in a light blue jersey and a player in a red jersey fought for the parried ball and the player in the red jersey kicked the ball right out of the field, and the narrator said, 'Finds Foden and Foden's shot was going into the corner.'.",
                        "C. A player in a light blue jersey passes the ball to another goalie in a green jersey, who tries to jump up and grab the ball, touching it but failing to grab it, another player in a red jersey receives the ball and shoots it straight at the goal, and the announcer says 'Edison parries it and Wolves have scored.'.",
                        "D. A player in a red jersey passes the ball to another goalie in a green jersey, who tries to jump up and grab the ball, touching it but failing to grab it, another player in a red jersey receives the ball and shoots it straight at the goal, and the announcer says 'Edison parries it and Wolves have scored.'."
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A"
                    }
                }
            ]
        },
        {
            src: 'videos/Multimodal Alignment/video.mp4',
            thumbnail: 'videos/Multimodal Alignment/video.jpg',
            title: 'Video 8',
            attributes: ['Multimodal Alignment'],
            questions: [
                {
                    time: 123, 
                    text: "Describe the correspond scene when a man said 'Thank you.'.",
                    taskType: 'Multimodal Alignment',
                    options: [
                        "A. In the living room, the man in yellow is talking to the man in blue on the left.",
                        "B. In one room, the person on the left puts down his water glass and talks, while the person on the right sits at a table and listens.",
                        "C. Three men are standing around the refrigerator, all checking it carefully.",
                        "D. In the cafeteria, three men are sitting at a table with a lot of food and drinks."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A"
                    }
                },
                {
                    time: 198,
                    text: "Describe the correspond scene when a man said 'I know, I just need you to stop talking.'.",
                    taskType: 'Multimodal Alignment',
                    options: [
                        "A. In one room, the person on the left puts down his water glass and talks, while the person on the right sits at a table and listens.",
                        "B. In a bar, a blonde woman with a beer bottle in her hand talks to a man in a red sweatshirt and glasses next to her.",
                        "C. Three men are standing around the refrigerator, all checking it carefully.",
                        "D. In the cafeteria, three men are sitting at a table with a lot of food and drinks."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 298,
                    text: "Describe the correspond scene when a man said 'Come in.'.",
                    taskType: 'Multimodal Alignment',
                    options: [
                        "A. In one room, the person on the left puts down his water glass and talks, while the person on the right sits at a table and listens.",
                        "B. In a bar, a blonde woman with a beer bottle in her hand talks to a man in a red sweatshirt and glasses next to her.",
                        "C. At the bedroom door, a man in his pajamas with a glowing green light in his hand was inviting the woman in.",
                        "D. In the cafeteria, three men are sitting at a table with a lot of food and drinks."
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C"
                    }
                },
                {
                    time: 342,
                    text: "Describe the correspond scene when a man said 'You can try, but you never catch me.'.",
                    taskType: 'Multimodal Alignment',
                    options: [
                        "A. In one room, the person on the left puts down his water glass and talks, while the person on the right sits at a table and listens.",
                        "B. In a bar, a blonde woman with a beer bottle in her hand talks to a man in a red sweatshirt and glasses next to her.",
                        "C. At the bedroom door, a man in his pajamas with a glowing green light in his hand was inviting the woman in.",
                        "D. A black hair, wearing a black man standing in the sea of colorful plastic ball inside to speak right."
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "D"
                    }
                },
                {
                    time: 394,
                    text: "Describe the correspond scene when a man said 'would you please turn the shirt off?'.",
                    taskType: 'Multimodal Alignment',
                    options: [
                        "A. In a bar, a blonde woman with a beer bottle in her hand talks to a man in a red sweatshirt and glasses next to her.",
                        "B. At the comic-themed store, a bespectacled man, with a resigned expression, talks to a man with a red horn strapped to his chest.",
                        "C. At the bedroom door, a man in his pajamas with a glowing green light in his hand was inviting the woman in.",
                        "D. A black hair, wearing a black man standing in the sea of colorful plastic ball inside to speak right."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                }
            ]
        },
        {
            src: 'videos/Emotion Recognition/video.mp4',
            thumbnail: 'videos/Emotion Recognition/video.jpg',
            title: 'Video 9',
            attributes: ['Emotion Recognition'],
            questions: [
                {
                    time: 51,
                    text: "What is the current emotion of the man wearing a black shirt with dreadlocks on the left side of the video?",
                    taskType: 'Emotion Recognition',
                    options: [
                        "A. He is sad.",
                        "B. He is happy.",
                        "C. He is angry.",
                        "D. He is calm."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "I apologize, but I do not actually have access to any video or images related to this question. Without being able to view the video content, I cannot determine the emotion of the man described or select the correct answer option. I would need to be able to see the relevant visual information in order to properly analyze and respond to this type of video-based question. If you're able to provide the video or images, I'd be happy to take a look and try to answer the question then."
                    }
                },
                {
                    time: 120,
                    text: "What is the current emotion of the man wearing a smoky gray suit with a black tie adorned with fine stripes on the right side of the video, and what caused his emotional changes?",
                    taskType: 'Emotion Recognition',
                    options: [
                        "A. He was calm because the story told by the man with dreadlocks was boring.",
                        "B. He was surprised and delighted because the story told by the man with dreadlocks was well-told and interesting.",
                        "C. He was angry because the story told by the man with dreadlocks was made up.",
                        "D. He was confused because he couldn't understand what the man with dreadlocks was saying."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 194,
                    text: "What is the current emotion of the man wearing a black shirt with dreadlocks on the left side of the video, and what caused his emotional changes?",
                    taskType: 'Emotion Recognition',
                    options: [
                        "A. He was speechless because he thought the question asked by the man in the smoky gray suit was absurd.",
                        "B. He smiled because he found the question asked by the man in the smoky gray suit amusing.",
                        "C. He was angry because he felt the question asked by the man in the smoky gray suit was offensive.",
                        "D. He was calm because he didn't care about the question asked by the man in the smoky gray suit."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 262,
                    text: "What was the emotion before and after the emotional change of the man wearing a black shirt with dreadlocks of the video?",
                    taskType: 'Emotion Recognition',
                    options: [
                        "A. He changed from being calm to being angry.",
                        "B. He changed from smiling to being angry.",
                        "C. He changed from smiling to crying sadly.",
                        "D. He transitioned from smiling to a state of calmness."
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "D"
                    }
                },
                {
                    time: 509,
                    text: "What is the current emotion of the man wearing a black shirt with dreadlocks on the left side of the video, and what caused his emotional changes?",
                    taskType: 'Emotion Recognition',
                    options: [
                        "A. He was excited because he enjoyed acting.",
                        "B. He was calm because he needed to get into character and say a line for the play.",
                        "C. He was angry because the man in the smoky gray suit asked him to act.",
                        "D. He was sad because he didn't like acting."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                }
            ]
        },
        {
            src: 'videos/Causal Reasoning/video.mp4',
            thumbnail: 'videos/Causal Reasoning/video.jpg',
            title: '4',
            attributes: ['Causal Reasoning'],
            questions: [
                {
                    time: 124,
                    text: "Why can thieves enter the room without being detected?",
                    taskType: 'Causal Reasoning',
                    options: [
                        "A. Because the security system is broken.",
                        "B. Because the masters have all fallen asleep.",
                        "C. Because the door was accidentally left unlocked.",
                        "D. Because the thieves are using a special device to stay silent."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 143,
                    text: "Why does this cat glare viciously at the person in black?",
                    taskType: 'Causal Reasoning', 
                    options: [
                        "A. Because the person in black took away the cat's favorite toy.",
                        "B. Because the person in black is blocking the cat's path.",
                        "C. Because the man in black just stepped on this cat.",
                        "D. Because the person in black made a loud noise that startled the cat."
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C"
                    }
                },
                {
                    time: 247,
                    text: "Why does the person start searching through his wardrobe?",
                    taskType: 'Causal Reasoning',
                    options: [
                        "A. Because he wants to clean his room.",
                        "B. Because he is checking if he has lost anything.",
                        "C. Because he is preparing to leave the house.",
                        "D. Because he cannot find his wallet."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 360,
                    text: "Why does the man offer his underwear to the woman as a replacement bag?",
                    taskType: 'Causal Reasoning',
                    options: [
                        "A. Because the woman forgot to bring her shopping bag.",
                        "B. Because the man is trying to make the woman laugh with a joke.",
                        "C. Because the lady's shopping bag is torn.",
                        "D. Because the woman mentioned she needed something to carry her things in."
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C"
                    }
                },


                {
                    time: 477,
                    text: "Why does the character hide behind structures on the roof?",
                    taskType: 'Causal Reasoning',
                    options: [
                        "A. Because he heard a loud noise and got scared.",
                        "B. Because he noticed a helicopter approaching and wanted to stay hidden.",
                        "C. Because the thief in black clothes spotted him and chased after him.",
                        "D. Because he saw the roof starting to collapse and needed to find safety."
                    ],
                    correctOption: 'C',
                    modelReplies: {
                        'Claude 3.5 sonnet': "C"
                    }
                }
            ]
        },
        

        {
            src: 'videos/Prospective Reasoning/video.mp4',
            thumbnail: 'videos/Prospective Reasoning/video.jpg',
            title: 'Math Tutorial - Perimeter',
            attributes: ['Prospective Reasoning'],
            questions: [
                {
                    time: 11,
                    text: "What might the speaker explain next?",
                    taskType: 'Prospective Reasoning',
                    options: [
                        "A. The area of different shapes.",
                        "B. How to measure the diameter.",
                        "C. The concept of length in 2-dimensional shapes.", 
                        "D. How to calculate perimeter."
                    ],
                    correctOption: 'D',
                    modelReplies: {
                        'Claude 3.5 sonnet': "D"
                    }
                },
                {
                    time: 133,
                    text: "What will the speaker most likely explain next?",
                    taskType: 'Prospective Reasoning',
                    options: [
                        "A. How to calculate the perimeter of the shape.",
                        "B. How to convert meters into centimeters.",
                        "C. The differences between perimeter and area.",
                        "D. How to measure the perimeter accurately."
                    ],
                    correctOption: 'A',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A"
                    }
                },
                {
                    time: 213,
                    text: "What might the speaker explain next?",
                    taskType: 'Prospective Reasoning',
                    options: [
                        "A. How to calculate the area of the rectangle.",
                        "B. How to find the perimeter of a rectangle.",
                        "C. How to label the units.",
                        "D. How to measure with a ruler."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                },
                {
                    time: 306,
                    text: "What might the speaker discuss next?",
                    taskType: 'Prospective Reasoning',
                    options: [
                        "A. How to calculate the perimeter of any regular polygon.",
                        "B. The significance of repeated addition.",
                        "C. The properties of regular polygons.",
                        "D. The importance of perimeter in geometry."
                    ],
                    correctOption: 'A',
                    modelReplies: {
                        'Claude 3.5 sonnet': "A"
                    }
                },
                {
                    time: 392,
                    text: "What might the speaker ask the students to do next?",
                    taskType: 'Prospective Reasoning',
                    options: [
                        "A. Calculate the area of the shape.",
                        "B. Determine the perimeter of the shape.",
                        "C. Measure each side length.",
                        "D. Convert the measurements to centimeters."
                    ],
                    correctOption: 'B',
                    modelReplies: {
                        'Claude 3.5 sonnet': "B"
                    }
                }
            ]
        }

    ];

    function init() {
        filteredVideos = [...videoList];
        initCategoryToggle();
        initFilterTags();
        initModelTags();
        initVideoPlayer();
        loadVideo(currentVideoIndex);
        generateVideoThumbnails();
    }

    // 初始化主类别展开/收缩
    function initCategoryToggle() {
        categoryHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const subCategoryContainer = header.nextElementSibling;
                const toggleIcon = header.querySelector('.toggle-icon');
                if (subCategoryContainer.style.display === 'none') {
                    subCategoryContainer.style.display = 'flex';
                    toggleIcon.textContent = '-';
                } else {
                    subCategoryContainer.style.display = 'none';
                    toggleIcon.textContent = '+';
                }
            });
        });
        // 默认收缩子类别
        const subCategoryContainers = document.querySelectorAll('.sub-category-container');
        subCategoryContainers.forEach(container => {
            container.style.display = 'none';
        });
    }

    // 异步加载数据函数
    async function loadData() {
        try {
            // 加载视频列表
            const response = await fetch('videos/videoList.json');
            const videoListData = await response.json();

            // 为每个视频加载对应的问题列表
            for (const video of videoListData) {
                const taskType = video.attributes[0]; // 假设第一个属性是任务类型
                const questionsResponse = await fetch(`videos/${taskType}/questions.json`);
                const questionsData = await questionsResponse.json();
                video.questions = transformQuestionData(questionsData);
            }

            // 设置全局变量
            videoList = videoListData;
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function transformQuestionData(questionsData) {
        return questionsData.map(q => {
            let modelReplies = {};
    
            // 收集模型回复
            for (const key in q) {
                if (!['task_type', 'question', 'time_stamp', 'answer', 'options', 'clue_start_time', 'clue_end_time', 'recallable_util', 'modified', 'frames_required', 'temporal_clue_type', 'question_id'].includes(key)) {
                    modelReplies[key] = q[key];
                }
            }
    
            // 将时间戳转换为秒
            const time = timeStampToSeconds(q.time_stamp);
    
            return {
                time: time,
                text: q.question,
                taskType: q.task_type,
                options: q.options,
                correctOption: q.answer,
                modelReplies: modelReplies
            };
        });
    }

    function timeStampToSeconds(timeStamp) {
        const parts = timeStamp.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 3) {
            // hh:mm:ss
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            // mm:ss
            seconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
            // ss
            seconds = parts[0];
        }
        return seconds;
    }

    // 初始化属性筛选标签
    function initFilterTags() {
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('active');
                filterVideos();
            });
        });
    }

    // 筛选视频
    function filterVideos() {
        const selectedFilters = Array.from(filterTags)
                                     .filter(tag => tag.classList.contains('active'))
                                     .map(tag => tag.dataset.attribute);

        if (selectedFilters.length === 0) {
            filteredVideos = [...videoList]; // 无筛选，显示所有视频
        } else {
            filteredVideos = videoList.filter(video => 
                selectedFilters.some(attr => video.attributes.includes(attr))
            );
        }
        currentVideoIndex = 0;
        if (filteredVideos.length > 0) {
            loadVideo(currentVideoIndex);
        } else {
            video.src = '';
            video.load();
            clearMarkers();
            questionPopup.style.display = 'none';
        }
        generateVideoThumbnails();
    }

    // 生成视频缩略图列表
    function generateVideoThumbnails() {
        videoThumbnailsContainer.innerHTML = '';
        filteredVideos.forEach((videoData, index) => {
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.classList.add('video-thumbnail');
            if (index === currentVideoIndex) {
                thumbnailDiv.classList.add('active');
            }

            const img = document.createElement('img');
            img.src = videoData.thumbnail || 'default-thumbnail.jpg';
            img.alt = videoData.title || '视频缩略图';

            const title = document.createElement('p');
            title.textContent = videoData.title || '未命名视频';

            thumbnailDiv.appendChild(img);
            thumbnailDiv.appendChild(title);

            thumbnailDiv.addEventListener('click', () => {
                currentVideoIndex = index;
                loadVideo(currentVideoIndex);
                updateActiveThumbnail();
            });

            videoThumbnailsContainer.appendChild(thumbnailDiv);
        });
        updateActiveThumbnail();
    }

    function updateActiveThumbnail() {
        const thumbnails = document.querySelectorAll('.video-thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === currentVideoIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // 初始化模型标签
    function initModelTags() {
        modelTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('active');
                updateModelReplies();
            });
        });
    }

    // 更新模型回复
    function updateModelReplies() {
        const modelRepliesContainer = document.getElementById('model-replies');
        const selectedModels = Array.from(modelTags)
            .filter(tag => tag.classList.contains('active'))
            .map(tag => tag.dataset.model);
 
        const question = currentQuestions.find(q => q.time === currentQuestionTime);
        if (!question) return;
 
        modelRepliesContainer.innerHTML = '';
 
        selectedModels.forEach(modelName => {
            if (question.modelReplies && question.modelReplies[modelName]) {
                const replyDiv = document.createElement('div');
                replyDiv.classList.add('model-reply');
 
                // Determine if the model's reply is correct
                const isCorrect = question.modelReplies[modelName][0] === question.correctOption;
                if (isCorrect) {
                    replyDiv.classList.add('correct');
                } else {
                    replyDiv.classList.add('incorrect');
                }
 
                const modelNameHeader = document.createElement('h4');
                modelNameHeader.textContent = modelName;
                replyDiv.appendChild(modelNameHeader);
 
                const replyText = document.createElement('p');
                replyText.textContent = question.modelReplies[modelName];
                replyDiv.appendChild(replyText);
 
                modelRepliesContainer.appendChild(replyDiv);
            }
        });
    }

    // 初始化视频播放器
    function initVideoPlayer() {
        // 初始化拖动事件
        initProgressHandle();
        initProgressContainer();

        // 视频事件
        video.addEventListener('loadedmetadata', function() {
            totalTimeDisplay.textContent = formatTime(video.duration);
            createMarkers();
        });

        video.addEventListener('timeupdate', function() {
            if (isDragging) return;

            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;
            updateProgressHandle(percent);

            currentTimeDisplay.textContent = formatTime(video.currentTime);

            checkAndShowQuestion(video.currentTime, false); // 自然播放
        });

        video.addEventListener('ended', function() {
            playPauseIcon.src = 'icons/play.png';
        });

        // 播放/暂停按钮事件
        playPauseBtn.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                playPauseIcon.src = 'icons/pause.png';
            } else {
                video.pause();
                playPauseIcon.src = 'icons/play.png';
            }
        });
    }

    function initProgressHandle() {
        progressHandle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            startDrag(e);
        });
    }

    function initProgressContainer() {
        progressContainer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            startDrag(e);
        });
    }

    function startDrag(e) {
        isDragging = true;
        video.pause();
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    function onDrag(e) {
        if (!isDragging) return;

        const rect = progressContainer.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, rect.width));

        const percent = (offsetX / rect.width) * 100;
        progressBar.style.width = `${percent}%`;
        updateProgressHandle(percent);

        const newTime = (percent / 100) * video.duration;
        currentTimeDisplay.textContent = formatTime(newTime);

        video.currentTime = newTime;

        checkAndShowQuestion(newTime, true); // 用户交互
    }

    function stopDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);

        video.play();
        playPauseIcon.src = 'icons/pause.png';
    }

    function updateProgressHandle(percent) {
        progressHandle.style.left = `${percent}%`;
    }

    function loadVideo(index) {
        if (filteredVideos.length === 0) {
            video.src = '';
            return;
        }

        const videoData = filteredVideos[index];
        if (videoData.youtubeUrl) {
            // Handle YouTube video
            const videoId = extractYoutubeId(videoData.youtubeUrl);
            const startTime = videoData.startTime || 0;
            video.src = `https://www.youtube.com/embed/${videoId}?start=${startTime}&enablejsapi=1`;
        } else {
            video.src = videoData.src;
        }
        video.load();
        video.currentTime = 0;
        currentQuestions = videoData.questions || [];
        resetQuestions();
        playPauseIcon.src = 'icons/play.png';
        clearMarkers();
        updateActiveThumbnail();
    }

    function extractYoutubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    // 清除标记
    function clearMarkers() {
        markersContainer.innerHTML = '';
    }

    // 创建标记
    function createMarkers() {
        const duration = video.duration;
        currentQuestions.forEach((question, index) => {
            if (question.text.trim() !== '') {
                const marker = document.createElement('div');
                marker.classList.add('marker');
                const percent = (question.time / duration) * 100;
                marker.style.left = `${percent}%`;

                // 添加点击事件
                marker.addEventListener('click', () => {
                    video.currentTime = question.time;
                    video.pause();
                    showQuestion(question, false); // 用户交互
                });

                markersContainer.appendChild(marker);
            }
        });
    }

    let currentQuestions = [];
    let currentQuestionTime = null;

    // 显示问题和模型回复
    function showQuestion(question, auto) {
        if (auto && shownQuestions.has(question.time)) return;
    
        const optionsList = document.getElementById('options-list');
        let questionContent = '';
    
        // Check if it's a Sequential Question
        if (question.taskType === 'Sequential Question Answering') {
            // Find previous question
            const prevQuestion = findPreviousQuestion(question);
            if (prevQuestion) {
                questionContent += `
                    <div class="previous-question">
                        <strong>Previous Question: </strong>${prevQuestion.text}<br>
                        <strong>Previous Task Type: </strong>${prevQuestion.taskType}<br>
                        <strong>Previous Query Time: </strong>${formatTime(prevQuestion.time)}<br>
                        <strong>Previous Answer: </strong>${prevQuestion.options.find(opt => opt.trim().charAt(0) === prevQuestion.correctOption)}
                    </div>
                `;
            }
        }
    
        // Add current question content
        questionContent += `<strong>Question: </strong>${question.text}<br>
            <strong>Task Type: </strong>${question.taskType}<br>
            <strong>Query Time: </strong>${formatTime(question.time)}`;
    
        // Add specific content for Proactive Output
        if (question.taskType === 'Proactive Output') {
            questionContent += `<br>
                <div class="ground-truth">
                    <strong>Ground Truth Response Time: </strong>${question.correctOption}<br>
                    <strong>Ground Truth Output: </strong>${question.groundTruthOutput}
                </div>`;
        }
    
        questionText.innerHTML = questionContent;
    
        optionsList.innerHTML = '';
    
        // Only show options list for non-Proactive Output questions
        if (question.options && question.taskType !== 'Proactive Output') {
            question.options.forEach(option => {
                const li = document.createElement('li');
                li.textContent = option;
                const optionIdentifier = option.trim().charAt(0);
                if(optionIdentifier === question.correctOption) {
                    li.classList.add('correct');
                }
                optionsList.appendChild(li);
            });
        }
    
        currentQuestionTime = question.time;
        updateModelReplies();
        questionPopup.style.display = 'block';
    
        // ... rest of the existing showQuestion function ...
    }

    // 检查并显示问题
    function checkAndShowQuestion(time, isUserInteraction) {
        const threshold = 1; // 时间阈值，单位秒
        const question = currentQuestions.find(q => Math.abs(q.time - time) <= threshold);

        if (question) {
            if (isUserInteraction) {
                // 显示问题但不暂停
                showQuestion(question, false);
            } else {
                if (!shownQuestions.has(question.time)) {
                    // 显示问题并暂停5秒
                    showQuestion(question, true);
                }
            }
        }
    }

    function findPreviousQuestion(currentQuestion) {
        const currentIndex = currentQuestions.findIndex(q => q.time === currentQuestion.time);
        if (currentIndex > 0) {
            return currentQuestions[currentIndex - 1];
        }
        return null;
    }

    // 隐藏问题弹出框
    function hideQuestion() {
        questionPopup.style.display = 'none';
    }

    // 重置问题状态
    function resetQuestions() {
        shownQuestions.clear();
        hideQuestion();
    }

    // 格式化时间
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return hrs > 0 
            ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` 
            : `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 页面初始加载
    init();
});
