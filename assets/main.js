const consonantData = [['ก', 'chicken', 'M'], ['ข', 'egg', 'H'], ['ฃ', 'bottle', 'H'], ['ค', 'buffalo', 'L'], ['ฅ', 'person', 'L'], ['ฆ', 'bell', 'L'], ['ง', 'snake', 'L'], ['จ', 'plate_dish', 'M'], ['ฉ', 'cymble', 'H'], ['ช', 'elephant', 'L'], ['ซ', 'chain', 'L'], ['ฌ', 'tree', 'L'], ['ญ', 'woman', 'L'], ['ฎ', 'headdress', 'M'], ['ฏ', 'goad', 'M'], ['ฐ', 'base', 'H'], ['ฑ', 'actress_name', 'L'], ['ฒ', 'old_person', 'L'], ['ณ', 'novice monk', 'L'], ['ด', 'child', 'M'], ['ต', 'turtle', 'M'], ['ถ', 'bag_sack', 'H'], ['ท', 'solider', 'L'], ['ธ', 'flag', 'L'], ['น', 'mouse', 'L'], ['บ', 'leaf', 'M'], ['ป', 'fish', 'M'], ['ผ', 'bee', 'H'], ['ฝ', 'lid', 'H'], ['พ', 'kind_of_tray', 'L'], ['ฟ', 'tooth_teeth', 'L'], ['ภ', 'sailboat', 'L'], ['ม', 'horse', 'L'], ['ย', 'ogre', 'L'], ['ร', 'boat', 'L'], ['ล', 'monkey', 'L'], ['ว', 'ring', 'L'], ['ศ', 'pavillion', 'H'], ['ษ', 'hermit', 'H'], ['ส', 'tiger', 'H'], ['ห', 'chest', 'H'], ['ฬ', 'kind_of_kite', 'L'], ['อ', 'basin', 'S'], ['ฮ', 'owl', 'L']];

class Thai {
  constructor() {
    this.initList = [];
    this.list = [];
    this.randomList = [];
  }
  // Pick a random word from the list but not the same word twice
  pickWord() {
    const index = Math.floor(Math.random() * this.list.length);
    const word = this.list[index];
    this.list.splice(index, 1);
    return word;
  }
  // Insert a new word to this.list
  insertWord(letter, meaning, letterClass) {
    this.list.push([letter, meaning, letterClass]);
  }
  insertInitList(lines) {
    for (let i = 1; i < lines.length - 1; i++) {
      const data = lines[i].split(',');
      const letter = data[0];
      const meaning = data[1];
      const letterClass = data[2];
      // Add to list
      this.initList.push([letter, meaning, letterClass]);
    }
  }
  insertRandomList(letter, meaning, letterClass) {
    this.randomList.push([letter, meaning, letterClass]);
  }

  getList() {
    return this.list;
  }
  getInitList() {
    return this.initList;
  }
  getRandomList() {
    return this.randomList;
  }

  // Pick random words from the list but not the same word twice
  pickWords(amount) {
    const words = [];
    for (let i = 0; i < amount; i++) {
      const word = this.pickWord();
      words.push(word);
    }
    return words;
  }

  init() {
    const questionNum = parseInt(document.getElementById('select-question-num').value);
    this.restart('init');
    if (questionNum) {
      this.list = [...consonantData];
      this.initList = this.pickWords(questionNum);
    } else {
      this.initList = [...consonantData];
    }
    this.list = [...this.initList];
    document.getElementById('btn-next').click();
  }

  insertList(lines) {
    for (let i = 1; i < lines.length - 1; i++) {
      const data = lines[i].split(',');
      const letter = data[0];
      const meaning = data[1];
      const letterClass = data[2];
      // Add to list
      this.insertWord(letter, meaning, letterClass);
    }
  }

  clearList() {
    this.list = [];
    this.randomList = [];
  }

  restart(type) {
    this.clearList();
    document.getElementById('btn-next').disabled = false;
    if (type !== 'init') {
      this.list = [...this.initList];
      // click next button
      document.getElementById('btn-next').click();
    } else {
      this.initList = [];
    }
  }

  // Create bootstrap table and show the list
  showList(type = 0) {
    let list;
    if (!type) {
      list = this.getList();
    } else {
      list = this.getRandomList();
    }
    let table = '<table class="table table-striped table-hover table-bordered">';
    table += '<thead><tr><th>#</th><th>Alphabet</th><th>Class</th><th>Name Meaning</th></tr></thead>';
    table += '<tbody>';
    for (let i = 0; i < list.length; i++) {
      let num = i + 1;
      table += '<tr>';
      table += '<td>' + num + '</td>';
      table += '<td>' + list[i][0] + '</td>';
      table += '<td>' + list[i][2] + '</td>';
      table += '<td>' + list[i][1] + '</td>';
      table += '</tr>';
    }
    table += '</tbody>';
    table += '</table>';
    document.getElementById('list').innerHTML = table;
  }
}

const thai = new Thai();

// Initialize the list when clicking the button
function init() {
  console.log('init');
  thai.init();
}

function restart() {
  thai.restart();
}

function randomDisplayOneWord() {
  let length = thai.getList().length;
  document.getElementById('description').innerHTML = thai.getInitList().length - thai.getList().length + 1 + ' / ' + thai.getInitList().length;

  if (length === 1) {
    // make the button disabled
    document.getElementById('btn-next').disabled = true;
  }
  const word = thai.pickWord();
  thai.insertRandomList(word[0], word[1], word[2]);
  // get the value from select option
  const quizType = document.getElementById('select-quiz-type').value;
  // create card and display with onclick
  let card = '<div class="card" style="width: 19rem; ">';
  card += '<div class="card-body">';
  card += '<p class="card-text">' + word[quizType] + '</p>';
  card += '</div>';
  card += '</div>';

  document.getElementById('list').innerHTML = card;
}

function showAnswer() {
  document.getElementById('description').innerHTML = 'Answers';
  thai.showList(1);
}

// document.getElementById('btn-init').addEventListener('click', init);
document.getElementById('btn-restart').addEventListener('click', restart);
document.getElementById('btn-next').addEventListener('click', randomDisplayOneWord);
document.getElementById('btn-answer').addEventListener('click', showAnswer);
// Restart when change the select option
document.getElementById('select-quiz-type').addEventListener('change', restart);

// Initialize when reload window
window.onload = function () {
  init();
}

// Initialize when modify the input amount
document.getElementById('select-question-num').addEventListener('change', init);

// Press space to click next button
document.onkeydown = function (e) {
  // prevent default action
  if (e.code == 'Space') {
    e.preventDefault();
    document.getElementById('btn-next').click();
  }
}