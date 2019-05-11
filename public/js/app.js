class Journal {
    constructor() {
        this.text = '';
        this.isActive = ''
        this.wordCount = 0;
        this.data = ''
        this.save = true;
        this.timeoutId;
        this.date = moment().startOf('day').format('YYYY-MM-DD');
        this.goal = 100;
        this.currentStreak = 0;
        this.isExpired = false;
        
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
        this.currentStreakEl = document.querySelector('#currentStreak');
    }

    bindEvents() {
        textArea.addEventListener('keyup', (e) => this.setText(e));
        this.monthDates.addEventListener('click', (e) => this.chooseDraftDate(e));
        textArea.addEventListener("change", this.OnInput, false);
        }

       getScrollParent(node) {
            if (node == null) {
                return null;
            }
        
            if (node.scrollHeight > node.clientHeight) {
                return node;
            } else {
                return getScrollParent(node.parentNode);
            }
        }

        OnInput() {
        
            const scrollParent = that.getScrollParent(this);
            const scrollTop = scrollParent ? scrollParent.scrollTop : null;
            const scrollLeft = scrollParent ? scrollParent.scrollLeft : null;
        
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        
            if (scrollParent) {
                scrollParent.scrollTo(scrollLeft, scrollTop);
            }
        }
    
    loadNotes() {

         // get all users notes // 
         fetch('/api/v1/notes')
         .then(function(res) {
             return res.json();
         }).then(function(res) {
             this.data = res.notes;
             this.isExpired = res.trialExpired;
             this.init();
         }.bind(this))

    }
    
    // setting initial text // 
    init() {

            // set today's date in site header // 
            this.todaysDate.innerHTML = moment().format('MMMM Do, YYYY');

            // loop through posts & check if it matches today
            var pos = this.data.map(function(e) { return moment(e.createdAt).startOf('day').format('YYYY-MM-DD'); }).indexOf(this.date);

            // if no post for today. tis a new day! 
            if(pos === -1) {

                // create a blank object for today's draft // 
                var note = {
                    content: '',
                    createdAt: this.date

                }

                this.data.push(note);
                this.isActive = this.data.length - 1
                this.text = this.data[this.isActive].content
                this.buildButtonList();
                this.render();

            } else {
            // if there is today's post. show it in textArea // 
            this.isActive = pos
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
        const s = this.currentStreak > 1 ? 's' : ''
        this.textArea.value = this.text
        this.count.innerText = this.getWordCount(this.text);
        this.textArea.style.height = 'auto';
        this.textArea.style.height = (this.textArea.scrollHeight) + 'px';
        this.currentStreakEl.innerText = `Current Streak: ${this.currentStreak} day${s}`;
        
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

        if(this.isExpired) return;
        // need to check if this is in the current data
        // if not then you need to submit a post request
        // if so, then submit an update request for that record
        // then take response & update state with it

        // check whether save var is true, which is set when date is today. cant save old posts // 
        if(this.save) {

            var body = {
                content: this.text,
                word_count: this.getWordCount(this.text)
            }
            // this checks whether this post was saved to DB or is new. brand new posts won't contain an 
            // updatedAt attribute.
            var post = this.data[this.isActive];
            if(post.updatedAt === undefined) {
 
                fetch("/api/v1/notes/new", {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    } 
                  }).then(res => res.json())
                  .then(response => {
                    
                    console.log('Success:', JSON.stringify(response))
                    this.data[this.isActive] = response;

                    this.saveStatus.innerHTML = 'post saved';

                  }).catch(error => console.error('Error:', error));
            } else {
   
                fetch(`/api/v1/notes/${post.id}/edit`, {
                    method: 'PUT', // or 'PUT'
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    } 
                  }).then(res => res.json())
                  .then(response => {
                      console.log('Success:', JSON.stringify(response))
                      this.data[this.isActive] = response[1];

                     this.saveStatus.innerHTML = 'post saved';
    
                  }).catch(error => console.error('Error:', error));
            }

            setTimeout(function() {
                this.saveStatus.innerHTML = '';
            }.bind(this), 2000)

        }

    }

    buildButtonList() {
    // get # of days in month = [5-1,5-2,etc...]
    var days = this.daysInMonth( moment().month() );


    // for each day build the buttons 
    days.forEach(function(day,key) {

        // get the month's day starting with 1. 
        var dayMonth = key + 1;

        // get the month 
        var m = new Date().getMonth();

        // build that day's date, and format it. 
        var date = moment(new Date(2019,m,dayMonth)).startOf('day').format('YYYY-MM-DD');
        
        // check whether there is writing for that day in data. 
        var pos = this.data.map(function(e) { return moment(e.createdAt).startOf('day').format('YYYY-MM-DD'); }).indexOf(date);
        
        // if its later this month, no color. 
        if(date > this.date) {
            this.addDateButton(dayMonth, date, 'none');

        // if today is before today, doesn't exist, or is below 100, none & streak dies. 
        } else if(pos === -1 || this.data[pos].word_count < this.goal) { 
            this.addDateButton(dayMonth, date, 'none');
            this.currentStreak = 0;
            // else if it is before today & its above 100, streak continues. 
        }  else {
            this.currentStreak++;
            this.addDateButton(dayMonth, date, 'goal');
        }

    }.bind(this));
    }

    addDateButton(day, date, goal) {
        // create the button 
        var p = document.createElement('button');   

        // make button orange if there's writing in it // 
        const style = goal === 'goal' ? 'active' : goal === 'noGoal' ? 'inactive' : 'none'

        if(date <= this.date) {
            p.classList.add('border');
        }
        
        // add class, data-val and append to mothDatesdiv. Set ac
        p.classList.add('button-day');
        p.setAttribute('data-day', day)
        p.title = moment(date).format('M-D')
        this.monthDates.appendChild(p);
        p.classList.add(style);
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
            this.isActive = pos
            this.save = false; 
            this.textArea.disabled = true;
        }  else {
            this.isActive = pos
            this.save = true;
            this.textArea.removeAttribute('disabled');
        }
        
        this.render();
    }
}

new Journal();

(function() {
    var burger = document.querySelector('.burger');
    var menu = document.querySelector('#'+burger.dataset.target);
    burger.addEventListener('click', function() {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });
})();

// (function() {

// var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

// // Check if there are any nav burgers
// if ($navbarBurgers.length > 0) {

//   // Add a click event on each of them
//   $navbarBurgers.forEach(function ($el) {
//     $el.addEventListener('click', function () {

//       // Get the target from the "data-target" attribute
//       var target = $el.dataset.target;
//       var $target = document.getElementById(target);

//       // Toggle the class on both the "navbar-burger" and the "navbar-menu"
//       $el.classList.toggle('is-active');
//       $target.classList.toggle('is-active');

//     });
//   });
// }
// })();