require("dotenv").config();
const Movie = require("./src/models/Movie");
const connectDB = require("./src/config/db");

const seedMovies = async () => {
  try {
    await connectDB();

    const movies = [
      {
        title: "Toy Story",
        category: ["Trending", "Family", "Kids", "Classics"],
        genre: ["family", "comedy"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
        description:
          "A story of toys that come to life when humans are not around.",
        director: "John Lasseter",
        cast: [
          { name: "Tom Hanks", role: "Woody (voice)" },
          { name: "Tim Allen", role: "Buzz Lightyear (voice)" },
        ],
        releaseYear: 1995,
      },

      {
        title: "Finding Nemo",
        category: ["Trending", "Family", "Kids", "Adventure"],
        genre: ["family", "adventure"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
        description:
          "A father fish searches for his lost son across the ocean.",
        director: "Andrew Stanton",
        cast: [
          { name: "Albert Brooks", role: "Marlin (voice)" },
          { name: "Ellen DeGeneres", role: "Dory (voice)" },
        ],
        releaseYear: 2003,
      },

      {
        title: "The Lion King",
        category: ["Popular", "Family", "Classics"],
        genre: ["family", "drama"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/2bXbqYdUdNVa8VIWXVfclP2ICtT.jpg",
        description: "A lion cub learns about responsibility and courage.",
        director: "Roger Allers",
        cast: [
          { name: "Matthew Broderick", role: "Simba (voice)" },
          { name: "James Earl Jones", role: "Mufasa (voice)" },
        ],
        releaseYear: 1994,
      },

      {
        title: "Frozen",
        category: ["Trending", "Popular", "Kids"],
        genre: ["family", "romance"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/kgwjIb2JDHRhNk13lmSxiClFjVk.jpg",
        description: "Two sisters navigate love and magical powers.",
        director: "Chris Buck",
        cast: [
          { name: "Idina Menzel", role: "Elsa (voice)" },
          { name: "Kristen Bell", role: "Anna (voice)" },
        ],
        releaseYear: 2013,
      },

      {
        title: "Shrek",
        category: ["Popular", "Family", "Comedy"],
        genre: ["family", "comedy"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
        description:
          "An ogre rescues a princess and finds unexpected friendship.",
        director: "Andrew Adamson",
        cast: [
          { name: "Mike Myers", role: "Shrek (voice)" },
          { name: "Eddie Murphy", role: "Donkey (voice)" },
        ],
        releaseYear: 2001,
      },

      {
        title: "Paddington",
        category: ["Family", "Kids"],
        genre: ["family", "comedy"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/7F8YlUeE3bJkL6r0R5K9g0UQ8hP.jpg",
        description: "A lovable bear finds a home in London.",
        director: "Paul King",
        cast: [
          { name: "Ben Whishaw", role: "Paddington (voice)" },
          { name: "Hugh Bonneville", role: "Mr. Brown" },
        ],
        releaseYear: 2014,
      },

      {
        title: "Coco",
        category: ["Trending", "Family", "Kids"],
        genre: ["family", "drama"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg",
        description: "A boy journeys into the land of the dead.",
        director: "Lee Unkrich",
        cast: [{ name: "Anthony Gonzalez", role: "Miguel (voice)" }],
        releaseYear: 2017,
      },

      {
        title: "Moana",
        category: ["Trending", "Adventure", "Kids"],
        genre: ["family", "adventure"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/4JeeYF2U7RUrhAjM1K9h4sE4P7.jpg",
        description: "A young girl sails the ocean to save her island.",
        director: "Ron Clements",
        cast: [{ name: "Auli'i Cravalho", role: "Moana (voice)" }],
        releaseYear: 2016,
      },

      {
        title: "Zootopia",
        category: ["Popular", "Family", "Kids"],
        genre: ["family", "comedy"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/sM33SANp9z6rXW8Itn7NnG1GOEs.jpg",
        description: "A bunny cop and fox solve a mysterious case.",
        director: "Byron Howard",
        cast: [{ name: "Ginnifer Goodwin", role: "Judy (voice)" }],
        releaseYear: 2016,
      },

      {
        title: "Inside Out",
        category: ["Popular", "Family"],
        genre: ["family", "drama"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/lRHE0vzf3oYJrhbsHXjIkF4Tl5A.jpg",
        description:
          "The emotions inside a young girl's mind struggle to guide her.",
        director: "Pete Docter",
        cast: [{ name: "Amy Poehler", role: "Joy (voice)" }],
        releaseYear: 2015,
      },
    ];

    await Movie.deleteMany();
    console.log("Old movies removed");

    await Movie.insertMany(movies);
    console.log("Movies seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedMovies();
