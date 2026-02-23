require("dotenv").config();
const Movie = require("./src/models/Movie.js"); // adjust path
const connectDB = require("./src/config/db.js");
const seedMovies = async () => {
  try {
    await connectDB();
    const movies = [
      {
        title: "Toy Story",
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
        title: "Paddington 2",
        genre: ["family", "comedy"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/1X7vow16X7CnCoexXh4H4F2yDJv.jpg",
        description: "Paddington gets into trouble while searching for a gift.",
        director: "Paul King",
        cast: [
          { name: "Ben Whishaw", role: "Paddington (voice)" },
          { name: "Hugh Grant", role: "Phoenix Buchanan" },
        ],
        releaseYear: 2017,
      },
      {
        title: "Matilda the Musical",
        genre: ["family", "drama"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/ga8R3OiH3K7J3sL9L5XkYh7C0R.jpg",
        description: "A gifted girl uses her powers to change her life.",
        director: "Matthew Warchus",
        cast: [
          { name: "Alisha Weir", role: "Matilda" },
          { name: "Emma Thompson", role: "Miss Trunchbull" },
        ],
        releaseYear: 2022,
      },
      {
        title: "Encanto",
        genre: ["family", "drama"],
        posterImgUrl:
          "https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg",
        description: "A magical family faces challenges when powers fade.",
        director: "Jared Bush",
        cast: [{ name: "Stephanie Beatriz", role: "Mirabel (voice)" }],
        releaseYear: 2021,
      },
      {
        title: "Coco",
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
        genre: ["family", "adventure"],
        director: "Ron Clements",
        cast: [{ name: "Auli'i Cravalho", role: "Moana (voice)" }],
        releaseYear: 2016,
      },
      {
        title: "Zootopia",
        genre: ["family", "comedy"],
        director: "Byron Howard",
        cast: [{ name: "Ginnifer Goodwin", role: "Judy (voice)" }],
        releaseYear: 2016,
      },
      {
        title: "Up",
        genre: ["family", "drama"],
        director: "Pete Docter",
        cast: [{ name: "Ed Asner", role: "Carl (voice)" }],
        releaseYear: 2009,
      },
      {
        title: "Inside Out",
        genre: ["family", "drama"],
        director: "Pete Docter",
        cast: [{ name: "Amy Poehler", role: "Joy (voice)" }],
        releaseYear: 2015,
      },
      {
        title: "The Incredibles",
        genre: ["family", "action"],
        director: "Brad Bird",
        cast: [{ name: "Craig T. Nelson", role: "Mr. Incredible (voice)" }],
        releaseYear: 2004,
      },
      {
        title: "The Incredibles 2",
        genre: ["family", "action"],
        director: "Brad Bird",
        cast: [{ name: "Craig T. Nelson", role: "Mr. Incredible (voice)" }],
        releaseYear: 2018,
      },
      {
        title: "Despicable Me",
        genre: ["family", "comedy"],
        director: "Pierre Coffin",
        cast: [{ name: "Steve Carell", role: "Gru (voice)" }],
        releaseYear: 2010,
      },
      {
        title: "Minions",
        genre: ["family", "comedy"],
        director: "Kyle Balda",
        cast: [{ name: "Pierre Coffin", role: "Minions (voice)" }],
        releaseYear: 2015,
      },
      {
        title: "Hotel Transylvania",
        genre: ["family", "comedy"],
        director: "Genndy Tartakovsky",
        cast: [{ name: "Adam Sandler", role: "Dracula (voice)" }],
        releaseYear: 2012,
      },
      {
        title: "Night at the Museum",
        genre: ["family", "comedy"],
        director: "Shawn Levy",
        cast: [{ name: "Ben Stiller", role: "Larry" }],
        releaseYear: 2006,
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
