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
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd1_9O7ZAMWdim0aZ3AGYpzugvq7EPOdJpHA&s",
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
          "data:image/jpeg;base64,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",
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
