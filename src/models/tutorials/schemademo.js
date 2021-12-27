var array;
array = [
  {
    //unit 1
    unitName: "Unit 1",
    sort: 1,
    topics: [
      {
        topicName: "topic1",
        sort: 1,
        data: {
          media: [
            {
              mediaType: "video",
              mediaUrl: "http://www.youtube.com/embed/dQw4w9WgXcQ",
            },
            {
              mediaType: "image",
              mediaUrl: "http://www.google.com/images/srpr/logo3w.png",
            },
          ],
          content: "This is the first topic of unit 1",
        },
      },
      {
        topicName: "topic2",
        sort: 2,
        data: {
          media: [
            {
              mediaType: "video",
              mediaUrl: "http://www.youtube.com/embed/dQw4w9WgXcQ",
            },
            {
              mediaType: "image",
              mediaUrl: "http://www.google.com/images/srpr/logo3w.png",
            },
          ],
          content: "This is the second topic of unit 1",
        },
      },
      
    ],
  },
  {
    //unit 2
    unitName: "Unit 2",
    sort: 2,
    topics: [
      {
        topicName: "topic1",
        data: {
          media: [
            {
              mediaType: "video",
              mediaUrl: "http://www.youtube.com/embed/dQw4w9WgXcQ",
            },
            {
              mediaType: "image",
              mediaUrl: "http://www.google.com/images/srpr/logo3w.png",
            },
          ],
          content: "This is the first topic of unit 2",
        },
      },
      {
        topicName: "topic2",
        data: {
          media: [
            {
              mediaType: "video",
              mediaUrl: "http://www.youtube.com/embed/dQw4w9WgXcQ",
            },
            {
              mediaType: "image",
              mediaUrl: "http://www.google.com/images/srpr/logo3w.png",
            },
          ],
          content: "This is the second topic of unit 2",
        },
      },
      
    ],
  },
];

// // create frequently asked questions schema
// const faqSchema = new mongoose.Schema({
//   faq: {
//     type: String,
//     required: true,
//   },
//   answer: {
//     type: String,
//     required: true,
//   },
//   sort: {
//     type: Number,
//     required: true,
//   },
// });

// //create new faq model schema
// const faqModel = mongoose.model("faq", faqSchema);

// //category scehma
 
// {
//   title:
//   description:
//   body:[
//     {
//       question:
//       answer
//       sort
//       isactive
//       media

//     }
//     is delete
//   ]
// }
