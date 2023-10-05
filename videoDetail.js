const Apikey=`AIzaSyBN3RSio9ShrFSmj0XTMtn558ywVV0bads`; 
const baseUrl=`https://www.googleapis.com/youtube/v3`;
const url ="https://www.googleapis.com/youtube/v3/commentThreads";
const commentContainer= document.getElementById("comments");
const playcard= document.getElementById("player-card");
const channelD= document.getElementById("channeldiv");
const recommendedVideo =document.querySelector(".recommended-video")

window.addEventListener("load", () => {
   console.log(document.cookie)
   let videoId = document.cookie.split("=")[1];
 
   if (YT) {
     new YT.Player("video-placeholder", {
       height: "300",
       width: "100%",
       videoId: videoId
     });
 
     loadComments(videoId);
     loadvideoDetails(videoId);
   }
 });
 
// comments loading....................

 async function loadComments(videoId)
 {
    let endpoint = `${url}?key=${Apikey}&videoId=${videoId}&maxResults=10&part=snippet`;

    let response =  await fetch(endpoint);
    let result =  await response.json();

    result.items.forEach((data)=>{
     const repliesCount = data.snippet.totalReplyCount;
     const {
         authorDisplayName,
         textDisplay,
         likeCount,
         authorProfileImageUrl: profileUrl,
         publishedAt,
     } = data.snippet.topLevelComment.snippet;

      let comment = document.createElement("div");
      comment.innerHTML=`
      <img src="${profileUrl}" alt="user"class="profile">
      <div class="comment-left">
          <b>${authorDisplayName}    <span class="grey size">    ${caluclateUploadTime(publishedAt)}</span></b>
          <p>${textDisplay}</p>
          <div class="like-share">
              <p><img src="Assets/like.svg" alt="like">${ converter(likeCount)}</p>
              <p><img src="Assets/dislike.svg" alt="dislike"></p>
              <p>reply</p>
           </div>
           <p style="color:rgb(82, 219, 82); ">${repliesCount} replies</p>
      </div>` ;
       commentContainer.appendChild(comment);
    })
 }
   

  async function  loadvideoDetails(videoId){

      const endpoint1=`${baseUrl}/videos?part=snippet,statistics&id=${videoId}&key=${Apikey}`;
      let response = await fetch(endpoint1);
      let result = await response.json();
      const data=result.items[0];

       let videodetail = document.createElement("div");
       videodetail.className="video-detail";
       videodetail.innerHTML=`
       <p>${data.snippet.title}</p>
      <div class="bottom-details">
       <p> ${data.statistics.viewCount} views .${ getDate(data.snippet.publishedAt)}</p>
       <div class="like-share">
           <p><img src="Assets/like.svg" alt="like">${converter(data.statistics.likeCount)}</p>
           <p><img src="Assets/dislike.svg" alt="dislike"></p>
           <p><img src="Assets/Share.svg" alt="share">SHARE</p>
           <p><img src="Assets/Save.svg" alt="save">SAVE</p>
           <img src="Assets/More.svg" alt="more">
       </div>
   </div>`;
    playcard.appendChild(videodetail);

    data.channelLogo = await getchannelLogo(data.snippet.channelId);
    

    const channeldiv = document.createElement("div");
    channeldiv.className="channel-div";
    channeldiv.innerHTML=` <div class="channelLogo">
    <div>
     <img src="${data.channelLogo}" alt="profile"class="profile">
      <div>
      <p>${data.snippet.channelTitle}</p>
      <p class="grey">1.2M Subscribers</p>
     </div>
   </div>
   <button class="btn-sub">SUBSCRIBES</button>
  </div>
  <div class="discription">
   <p>${data.snippet.description}</p>
   <p class="grey">SHOW MORE</p>
   </div>`

   channelD.appendChild(channeldiv);
  
   }

 async function getchannelLogo(channelId) {

     const endpoint2=`${baseUrl}/channels?key=${Apikey}&id=${channelId}&part=snippet`;
     try{
         const response = await fetch(endpoint2);
         const result = await response.json();
         // console.log(result);
         return result.items[0].snippet.thumbnails.high.url;
 
     }
     catch(error){
         alert("An error occured at fetching channel logo")
     }
   }
 function getDate(day){
   
   const date = new Date();
   const n=date.getMonth();
  return `${date.getDay()}/${n+1}/${date.getFullYear()} `

 }
 function caluclateUploadTime(publish){

   const currentDate = new Date();
   const publishDate =new Date(publish);
  
   let secondsGap = (currentDate.getTime()-publishDate.getTime())/1000;
  
   const secondsPerDay = 24 * 60 * 60;
   const secondsPerWeek = 7 * secondsPerDay;
   const secondsPerMonth = 30 * secondsPerDay;
   const secondsPerYear = 365 * secondsPerDay;
  
   if (secondsGap < secondsPerDay) {
     return `${Math.floor(secondsGap / (60 * 60))}hrs ago`;
   }
   if (secondsGap < secondsPerWeek) {
     return `${Math.floor(secondsGap / secondsPerDay)} days ago`;
   }
   if (secondsGap < secondsPerMonth) {
     return `${Math.floor(secondsGap / secondsPerWeek)} weeks ago`;
   }
   if(secondsGap < secondsPerYear) {
     return `${Math.floor(secondsGap / secondsPerMonth)} months ago`;
   }
  
   return `${Math.floor(secondsGap / secondsPerYear)} years ago`;
  
  }

  function converter(value){
    value= Number(value);
    if(value<1000){
        return `${value} `;
    }
    if(value<100000)
    {
       return `${Math.floor(value/1000)}k`
    }
    if(value<1000000)
    {
        return `${Math.floor(value/100000)}lakh`
    }
    return `${Math.floor(value/1000000)}M`
 }



async function FetchsearchResult(searchValue) {
  const endpoint = `${baseUrl}/search?key=${Apikey}&part=snippet&q=${searchValue}&maxResults=20`;
  try {
    const response = await fetch(endpoint);
    const Data = await response.json();

    // for(let i=0;i<Data.items.length;i++)
    // {
    //     let videoId = Data.items[i].id.videoId;
    //     let channelId = Data.items[i].snippet.channelId;

    //     // let statistics = await getVideoStatistics(videoId);
    //     let channelLogo = await getchannelLogo(channelId);

    //   //  Data.items[i].statistics = statistics;
    //    Data.items[i].channelLogo = channelLogo;
  
    // }
    
    renderOntoUI(Data.items);
  } catch (error) {
    alert(`An error occured ${error}`);
  }
}

function renderOntoUI(videoItems){

  videoItems.forEach((item)=>{

    const RDiv = document.createElement("div");
    RDiv.className="R-card";
    RDiv.innerHTML=` <img src="${item.snippet.thumbnails.high.url}" alt="">
    <div>
        <p>${item.snippet.title}</p>
        <p class="grey size">${item.snippet.channelTitle}</p>
        <p class="grey size">1M views.3 years ago</p>
    </div>`
    recommendedVideo.append(RDiv);
  })
}
FetchsearchResult("latest trailer");