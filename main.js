
var access_token;
function load() {




   console.log(window.location);
   access_token = window.location.hash.substring(14);


 
   new Timer(
       document.querySelector(".timer")
   );
 
}




function play() {
   const options = {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         Authorization: 'Bearer ' + access_token
       },
       body: '{"context_uri":"spotify:playlist:0vvXsWCC9xrXsKd4FyS8kM"}'
     };
   
     fetch('https://api.spotify.com/v1/me/player/play', options)
       .then(response => response.json())
       .then(response => console.log(response))
       .catch(err => console.error(err));
}




function pause() {
   const options = {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         Authorization: 'Bearer ' + access_token
       },
       body: 'false'
     };
   
     fetch('https://api.spotify.com/v1/me/player/pause', options)
       .then(response => response.json())
       .then(response => console.log(response))
       .catch(err => console.error(err));
}




class Timer {
   constructor(root) {
       root.innerHTML = Timer.getHTML();




       this.el = {
           minutes: root.querySelector(".timer__part--minutes"),
           seconds: root.querySelector(".timer__part--seconds"),
           control: root.querySelector(".timer__btn--control"),
           reset: root.querySelector(".timer__btn--reset"),
       };




       this.interval = null;
       this.state = 0;
       this.remainingSeconds = 1500;




       this.updateInterfaceTime();




       this.el.control.addEventListener("click", () => {
           if (this.interval == null && this.state===0) {
               play();
               this.start();
           } else if (this.interval == null && this.state==1) {
               this.rest();
           }
            else {
                pause();
                this.stop();
   
           }
       });
     
     
       this.el.reset.addEventListener("click", () => {
           pause();
           this.stop();
           this.state = 0;
           this.remainingSeconds = 1500;
           this.updateInterfaceTime();
       });




   }




   updateInterfaceTime() {
       const minutes = Math.floor(this.remainingSeconds / 60);
       const seconds = this.remainingSeconds % 60;




       this.el.minutes.textContent = minutes.toString().padStart(2, "0");
       this.el.seconds.textContent = seconds.toString().padStart(2, "0");
   }




   updateInterfaceControls() {
       if (this.interval === null) {
           this.el.control.innerHTML = `<span class="material-symbols-outlined">play_arrow</span>`;
           this.el.control.classList.add("timer__btn--start");
           this.el.control.classList.remove("timer__btn--stop");
       }
       else {
           this.el.control.innerHTML = `<span class="material-symbols-outlined">pause</span>`;
           this.el.control.classList.add("timer__btn--stop");
           this.el.control.classList.remove("timer__btn--start");
       }
   }




   start() {
       if (this.remainingSeconds === 0) {
            this.remainingSeconds = 300;
            this.updateInterfaceTime();
            this.state = 1
            return;
        }




       this.interval = setInterval(() => {
           this.remainingSeconds--;
           this.updateInterfaceTime();




           if (this.remainingSeconds === 0) {
                pause();
               this.stop();
           }
       }, 1000);




       this.updateInterfaceControls();
   }




   stop() {
       clearInterval(this.interval);




       this.interval = null;




       this.updateInterfaceControls();
   }


   
   rest() {
       if (this.remainingSeconds === 0) {
            this.remainingSeconds = 1500;
            this.updateInterfaceTime;
            this.state = 0;
            return;
        }




       this.interval = setInterval(() => {
           this.remainingSeconds--;
           this.updateInterfaceTime();




           if (this.remainingSeconds === 0) {
               this.stop();
           }
       }, 1000);
   


       this.updateInterfaceControls();
   }
   




   static getHTML() {
       return `
           <span class="timer__part timer__part--minutes">00</span>
           <span class="timer__">:</span>
           <span class="timer__part timer__part--seconds">00</span>
           <button type="button" class="timer__btn timer__btn--control timer__btn--start">
               <span class="material-symbols-outlined">play_arrow</span>
           </button>
           <button type="button" class="timer__btn timer__btn--reset">
               <span class="material-symbols-outlined">timer</span>
           </button>
       `;




   }
}







