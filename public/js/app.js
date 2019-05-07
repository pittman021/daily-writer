class Journal {
    constructor() {
        this.text = '';
        this.isActive = ''
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
             this.data = res;
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
                    content: 'Today is a new day! Start writing =)',
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
        this.textArea.value = this.text
        this.count.innerText = this.getWordCount(this.text);
        this.textArea.style.height = 'auto';
        this.textArea.style.height = (this.textArea.scrollHeight) + 'px';
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

new Journal()