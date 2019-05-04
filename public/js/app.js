class Journal {
    constructor() {
        this.text = 'hello';
        this.wordCount = 0;
        this.data = ''
        this.save = true;
        this.timeoutId;
        this.date = moment().startOf('day').format('YYYY-MM-DD');
        
        // get things going // 
        this.cacheDom();
        this.bindEvents();
        this.loadNotes();
    }

    cacheDom() {
        this.textArea = document.querySelector('#textArea');
        this.count = document.querySelector('#count');
        // var wordGoal = document.querySelector('#word-goal');
        this.saveStatus = document.querySelector('#save-status');
        this.todaysDate = document.querySelector('#todays-date');
        this.monthDates = document.querySelector('#month-dates');
        this.tx = document.getElementsByTagName('textarea');
    }

    bindEvents() {
        textArea.addEventListener('keyup', (e) => this.setText(e));
        this.monthDates.addEventListener('click', (e) => this.chooseDraftDate(e));
        textArea.addEventListener("input", this.OnInput, false);
        }

        OnInput() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            textArea.scrollTop = textArea.scrollHeight;
            }
    
    
    loadNotes() {

         // get all users notes // 
         fetch('/api/v1/notes')
         .then(function(res) {
             return res.json();
         }).then(function(res) {
             this.data = res;
             this.init();
         }.bind(this))

    }
    
    // setting initial text // 
    init() {

            // set today's date in site header // 
            this.todaysDate.innerHTML = moment().format('MMMM Do, YYYY');


            // get today's date 
            var date1 = moment(this.data[0].createdAt).startOf('day').format('YYYY-MM-DD');

            // loop through posts & check if it matches today
            var pos = this.data.map(function(e) { return moment(e.createdAt).startOf('day').format('YYYY-MM-DD'); }).indexOf(this.date);

            // if no post for today. tis a new day! 
            if(pos === -1) {
                this.text = "Today is a new day! Start writing =)";
        
                this.buildButtonList();
                this.render();
            } else {
            // if there is today's post. show it in textArea // 
            this.text = this.data[pos].content
            this.buildButtonList();
            this.render();
            }
        }

    getWordCount(str) {
        return str.split(' ')
        .filter(function(n) { return n != '' })
        .length;
    }

    render() {
        this.textArea.value = this.text
        this.count.innerText = this.getWordCount(this.text);
        this.textArea.style.height = 'auto';
        this.textArea.style.height = (this.textArea.scrollHeight) + 'px';
        this.setStorage(this.data)
    }

  
    setText(e) {
        this.text = e.target.value;
        if(e.keyCode === 32) {
            if (this.timeoutId) clearTimeout(this.timeoutId);
        
            // Set timer that will save comment when it fires.
            this.timeoutId = setTimeout(this.saveDraftToStorage.bind(this), 3000);
        }
        this.render()
    }

    saveDraftToStorage() {


        // need to check if this is in the current data
        // if not then you need to submit a post request
        // if so, then submit an update request for that record
        // then take response & update state with it
        //



        var date = new Date(new Date().toDateString()).toString();

        // check whether save var is true, which is set when date is today. cant save old posts // 
        if(this.save) {

        // there should always be a draft
            var pos = this.data.map(function(e) { return e.date; }).indexOf(date);
            
            // if date is not found. push new record for that date // 
            if(pos === -1) {
                var obj = {
                    draft: this.text,
                    date: date
                }
                this.data.push(obj);
                this.setStorage(this.data);
                this.saveStatus.innerHTML = 'post saved';
                    setTimeout(function() {
                        saveStatus.innerHTML = '';
                    }.bind(this), 2000)
                
                // update draft if date already exist // 
                } else {
                    this.data[pos].draft = this.text
                    this.setStorage(this.data);
                    this.saveStatus.innerHTML = 'post saved';
                    setTimeout(function() {
                        this.saveStatus.innerHTML = '';
                    }.bind(this), 2000)
                }

        }
    }

    buildButtonList() {
    var days = this.daysInMonth( moment().month() );
    days.forEach(function(day,key) {
        var dayMonth = key + 1;
        // get the month 
        var m = new Date().getMonth();
        var date = moment(new Date(2019,m,dayMonth)).startOf('day').format('YYYY-MM-DD');
    
        var pos = this.data.map(function(e) { return moment(e.createdAt).startOf('day').format('YYYY-MM-DD'); }).indexOf(date);
        if(pos === -1) {
            this.addDateButton(day,dayMonth,date, true)
        } else {
            this.addDateButton(day,dayMonth,date, false);
        
        }
    }.bind(this));
    }

    addDateButton(buttonText, day, date, disabled) {
        // create the button 
        var p = document.createElement('button');   

        // make button blue if there's writing in it // 
        if(!disabled) {
            p.classList.add('active');
          }

        // add class, data-val and append to mothDatesdiv. Set ac
        p.classList.add('button-day');
        p.setAttribute('data-day', day)
        p.title = moment(date).format('M-D')
        this.monthDates.appendChild(p);
        // p.disabled = disabled;
  }

    daysInMonth(month) {
        var count =  moment().month(month).daysInMonth();
        var days = [];
        for (var i = 1; i < count+1; i++) {
          days.push(moment().month(month).date(i).format('M-D'));
        }
        return days;
      }

      chooseDraftDate(e) {
        var d = e.target.dataset.day;
        var m = new Date().getMonth();
        var today = moment().startOf('day').format('YYYY-MM-DD');
        var date = moment(new Date(new Date(2019,m,d))).startOf('day').format('YYYY-MM-DD');
        var pos = this.data.map(function(e) { return moment(e.createdAt).startOf('day').format('YYYY-MM-DD') }).indexOf(date);

        // update textArea of date selected
        this.text = this.data[pos].content;
        // if not today's date, disable save & textArea
        if(date !== today) {
            this.save = false; 
            this.textArea.disabled = true;
        }  else {
            this.save = true;
            this.textArea.removeAttribute('disabled');
        }
        
        this.render();
    }


}

new Journal()
    
        
        // jessus can you clean this up?
//     chooseDraftDate() {
//             var d = e.target.dataset.day;
//             var m = new Date().getMonth();
//             var today = new Date(new Date().toDateString()).toString();
//             var date = new Date(new Date(2019,m,d).toDateString()).toString();
//             var data = JSON.parse(localStorage.getItem('drafts'));
//             var pos = data.map(function(e) { return e.date; }).indexOf(date);
    
//             // update textArea of date selected
//             textArea.value = data[pos].draft
//             // if not today's date, disable save & textArea
//             if(date !== today) {
//                 save = false; 
//                 textArea.disabled = true;
//             }  else {
//                 save = true;
//                 textArea.removeAttribute('disabled');
//             }
           
//             updateCount();
//         }

//     for (var i = 0; i < tx.length; i++) {
//         tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
//         tx[i].addEventListener("input", OnInput, false);
//         }
    
//         function OnInput() {
//         this.style.height = 'auto';
//         this.style.height = (this.scrollHeight) + 'px';
//         }

// }

//     // Helper Functions


//     successCheck(wordCount) {
//         if(wordCount < goal) {
//             count.classList.remove('success');
//         } else {
//             count.classList.add('success');
//         }
//     }

//     // setup
//     buildButtonList() {
//         var days = daysInMonth( moment().month() );
//         days.forEach(function(day,key) {
//             var dayMonth = key + 1;
//            // get the month 
//             var m = new Date().getMonth();
//             var date = new Date(new Date(2019,m,dayMonth).toDateString()).toString();
//             var data = JSON.parse(localStorage.getItem('drafts'));
//             if(!data) {
//               addDateButton(day,dayMonth, true);
              
//             } else {
//               var pos = data.map(function(e) { return e.date; }).indexOf(date);
//               if(pos === -1) {
//                   addDateButton(day,dayMonth, true)
//                 } else {
//                     addDateButton(day,dayMonth, false);
//                 }
//             }
//         });
//     }

//       // set days or whatever // 
//       addDateButton(buttonText, day, disabled) {
//             // create the button 
//             var p = document.createElement('button');   
//             var t = document.createTextNode(buttonText);
//             p.setAttribute('data-day', day)
//             p.disabled = true;
//             p.appendChild(t);
//             monthDates.appendChild(p);
//             p.disabled = disabled;
//       }

//     daysInMonth(month) {
//         var count =  moment().month(month).daysInMonth();
//         var days = [];
//         for (var i = 1; i < count+1; i++) {
//           days.push(moment().month(month).date(i).format('M-D'));
//         }
//         return days;
//       }


