import img from "../assets/img/plug.PNG"

// =========================
// БАЗОВЫЕ МЕДИА 
// =========================

const defaultMedia = [
    // =========================
    // СЕРИАЛЫ
    // =========================

    {
        id: 1,
        title: "Касл",
        type: "series",
        description: "Детектив с писателем",      
        status: "want",    
        watchDate: null,
        link: "https://www.imdb.com/title/tt1219024/",
        episodeDuration: 43,
        totalEpisodes: 173,
        progress: 0,
        image: img
    },
    {
        id: 2,
        title: "Менталист",
        type: "series",
        description: "Бывший ясновидящий помогает полиции",
        status: "want", 
        watchDate: null,
        link: "https://www.imdb.com/title/tt1196946/",
        episodeDuration: 43,
        totalEpisodes: 151,
        progress: 0,
        image: img
    },
    {
        id: 3,
        title: "Сверхъестественное",
        type: "series",
        description: "Братья охотятся на монстров",
        status: "want", 
        watchDate: null,
        link: "https://www.imdb.com/title/tt0460681/",
        episodeDuration: 60,
        totalEpisodes: 327,
        progress: 0,
        image: img
    },
    {
        id: 4,
        title: "Акушер",
        type: "series",
        description: "Драма о работе акушера",
        status: "want",
        watchDate: null,
        link: null,
        episodeDuration: 50,
        totalEpisodes: 24,
        progress: 0,
        image: img
    },
    {
        id: 5,
        title: "Уличное правосудие",
        type: "series",
        description: "Герои борются с преступностью",
        status: "want",
        watchDate: null,
        link: null,
        episodeDuration: 45,
        totalEpisodes: 22,
        progress: 0,
        image: img
    },

    // =========================
    // ФИЛЬМЫ
    // =========================

    {
        id: 6,
        title: "Furry Nights",
        type: "film",
        description: "Мистический триллер",
        status: "want",
        watchDate: null,
        link: null,
        duration: 120,
        progress: 0,
        image: img
    },
    {
        id: 7,
        title: "Fursonas",
        type: "film",
        description: "Документальный фильм",
        status: "want",
        watchDate: null,
        link: "https://www.imdb.com/title/tt6867618/",
        duration: 89,
        progress: 0,
        image: img
    },
    {
        id: 8,
        title: "Зверополис",
        type: "film",
        description: "Мультфильм про город животных",
        status: "want",
        watchDate: null,
        link: "https://www.imdb.com/title/tt2948356/",
        duration: 108,
        progress: 0,
        image: img
    },
    {
        id: 9,
        title: "Дюна",
        type: "film",
        description: "Эпическая фантастика",
        status: "want",
        watchDate: null,
        link: null,
        duration: 155,
        progress: 0,
        image: img
    },
    {
        id: 10,
        title: "Топи",
        type: "film",
        description: "Российский хоррор",
        status: "want",
        watchDate: null,
        link: null,
        duration: 120,
        progress: 0,
        image: img
    }
]

export default defaultMedia