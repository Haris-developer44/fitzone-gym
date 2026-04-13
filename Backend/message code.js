import axios from "axios";
import env from "dotenv";
import fs from "fs";
import FormData from "form-data";
env.config();
// async function sendMessage(){
//   try{
//     console.log("posting request to whatsapp.....");
//     const response = await axios({
//       url:'https://graph.facebook.com/v22.0/1040915695774969/messages',
//       method:'post',
//       headers:{
//         'Authorization':`Bearer ${process.env.WA_TOKEN}`,
//         'Content-Type':'application/json',
//       },
//       data: JSON.stringify({
//         messaging_product:'whatsapp',
//         to:'923165491386',
//         type:'template',
//         template:{
//           name:'hello_world',
//           language:{
//             code:'en_US',
//           },
//         }
//       })
//     })
//     console.log("response data: ",response.data);
//   }catch(err){
//     console.error(err);
//   }
// }

// sendMessage();





//sending text messages

const sendTextMessage = async (name) => {
  try {
    console.log("posting request to whatsapp.....");
    const response = await axios({
      url: 'https://graph.facebook.com/v22.0/1040915695774969/messages',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${process.env.WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        messaging_product: 'whatsapp',
        to: '923165491386',
        type: 'text',
        text: {
          body: `Assalamualaikum,${name}\n Your attendance is marked as present at ${new Date()}`,
        }
      })
    })
    // console.log("response data: ", response.data);
  } catch (err) {
    console.error(err);
  }
}

// sendTextMessage();



//sending images
async function sendMediaMessage() {
  try {
    console.log("posting request to whatsapp.....");
    const response = await axios({
      url: 'https://graph.facebook.com/v22.0/1040915695774969/messages',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${process.env.WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        messaging_product: 'whatsapp',
        to: '923165491386',
        type: 'image',
        image: {
          // link:'https://cdn.pixabay.com/photo/2017/01/20/00/30/maldives-1993704_1280.jpg',
          id: '1540856441379711',
          caption: 'this is an image'
        }
      })
    })
    console.log("response data: ", response.data);
  } catch (err) {
    console.error(err);
  }
}




//sending uploaded messages
// async function UploadImage() {
//   const data = new FormData();
//   data.append('messaging_product', 'whatsapp');
//   data.append('file', fs.createReadStream(process.cwd() + '/image.png', { ContentType: 'image/png' }));
//   data.append('type', 'image/png');
//   const response = await axios({
//     url: 'https://graph.facebook.com/v22.0/1040915695774969/media',
//     method: 'post',
//     headers: {
//       'Authorization': `Bearer ${process.env.WA_TOKEN}`
//     },
//     data: data
//   })
//   console.log("UploadImage: ", response.data);
//   //this will show the id of the image uploaded. then we will replace the link in the sendMediaMessage() to the id
// }
// sendMediaMessage();
// UploadImage();

async function uploadMedia(filePath) {
  const form = new FormData();

  form.append("file", fs.createReadStream(filePath));
  form.append("messaging_product", "whatsapp");

  const response = await axios.post(
    `https://graph.facebook.com/v22.0/1040915695774969/media`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  return response.data.id; // 🔥 MEDIA ID
}


//sending message in our custom own template with variable

// async function sendMessage(){
//   try{
//     console.log("posting request to whatsapp.....");
//     const response = await axios({
//       url:'https://graph.facebook.com/v22.0/1040915695774969/messages',
//       method:'post',
//       headers:{
//         'Authorization':`Bearer ${process.env.WA_TOKEN}`,
//         'Content-Type':'application/json',
//       },
//       data: JSON.stringify({
//         messaging_product:'whatsapp',
//         to:'923165491386',
//         type:'template',
//         template:{
//           name:'discount',
//           language:{
//             code:'en_US',
//           },
//           components:[
//             {
//               type:'header',
//               parameters:[
//                 {
//                   type:'text',
//                   text:'Haris'
//                 }
//               ]
//             },
//             {
//               type:'body',
//               parameters:[
//                 {
//                   type:'text',
//                   text:'30'
//                 }
//               ]

//             }
//           ]
//         }
//       })
//     })
//     console.log("response data: ",response.data);
//   }catch(err){
//     console.error(err);
//   }
// }

// sendMessage();

export default sendTextMessage;