const consonantData = [['ก', 'chicken', 'M'], ['ข', 'egg', 'H'], ['ฃ', 'bottle', 'H'], ['ค', 'buffalo', 'L'], ['ฅ', 'person', 'L'], ['ฆ', 'bell', 'L'], ['ง', 'snake', 'L'], ['จ', 'plate_dish', 'M'], ['ฉ', 'cymbal', 'H'], ['ช', 'elephant', 'L'], ['ซ', 'chain', 'L'], ['ฌ', 'tree', 'L'], ['ญ', 'woman', 'L'], ['ฎ', 'headdress', 'M'], ['ฏ', 'goad', 'M'], ['ฐ', 'base', 'H'], ['ฑ', 'actress_name', 'L'], ['ฒ', 'old_person', 'L'], ['ณ', 'novice monk', 'L'], ['ด', 'child', 'M'], ['ต', 'turtle', 'M'], ['ถ', 'bag_sack', 'H'], ['ท', 'solider', 'L'], ['ธ', 'flag', 'L'], ['น', 'mouse', 'L'], ['บ', 'leaf', 'M'], ['ป', 'fish', 'M'], ['ผ', 'bee', 'H'], ['ฝ', 'lid', 'H'], ['พ', 'kind_of_tray', 'L'], ['ฟ', 'tooth_teeth', 'L'], ['ภ', 'sailboat', 'L'], ['ม', 'horse', 'L'], ['ย', 'ogre', 'L'], ['ร', 'boat', 'L'], ['ล', 'monkey', 'L'], ['ว', 'ring', 'L'], ['ศ', 'pavilion', 'H'], ['ษ', 'hermit', 'H'], ['ส', 'tiger', 'H'], ['ห', 'chest', 'H'], ['ฬ', 'kind_of_kite', 'L'], ['อ', 'basin', 'S'], ['ฮ', 'owl', 'L']];

const vowelData = [['อะ', 'a', '[a]'], ['อา', 'aa', '[aː]'], ['อิ', 'i', '[i]'], ['อี', 'ii', '[iː]'], ['อึ', 'ue', '[ɯ]'], ['อื', 'uee', '[ɯː]'], ['อุ', 'u', '[u]'], ['อู', 'uu', '[uː]'], ['เอะ', 'e', '[e]'], ['เอ', 'ay', '[eː]'], ['เเอะ', 'ae’', '[ɛ]'], ['เเอ', 'ae', '[ɛː]'], ['โอะ', 'o', '[o]'], ['โอ', 'oh', '[oː]'], ['เอาะ', 'or’', '[ɔ]'], ['ออ', 'or', '[ɔː]'], ['เออะ', 'oe’', '[ɤ]'], ['เออ', 'oe', '[ɤː]'], ['เอียะ', 'ia’', '[ia]'], ['เอีย', 'ia', '[iaː]'], ['เอือะ', 'uea’', '[ɯa]'], ['เอือ', 'uea', '[ɯaː]'], ['อัวะ', 'ua’', '[ua]'], ['อัว', 'ua', '[uaː]'], ['อ ํา', 'am', '[am]'], ['เอา', 'ao', '[ao]'], ['ไอ', 'ai', '[ai]'], ['ใอ', 'ai', '[ai]'], ['ไอย', 'ai', '[ai]'], ['อัย', 'ai', '[ai]'], ['ฤ', 'rue', '[rue]'], ['ฤๅ', 'ruee', '[rueː]'], ['ฦ', 'lue', '[lue]'], ['ฦๅ', 'luee', '[lueː]']];


class Thai {
  constructor() {
    this.initList = [];
    this.list = [];
    this.randomList = [];
    this.topicType = 'consonant';
    this.quizTypeIndex = 0;
  }
  // Pick a random word from the list but not the same word twice
  pickWord() {
    const index = Math.floor(Math.random() * this.list.length);
    const word = this.list[index];
    this.list.splice(index, 1);
    return word;
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

  // Get different lists
  getList() {
    return this.list;
  }
  getInitList() {
    return this.initList;
  }
  getRandomList() {
    return this.randomList;
  }

  init() {
    const questionNum = parseInt(document.getElementById('select-question-num').value);
    const topicType = this.getTopicType();
    let data;
    this.restart('init');
    // Refer to consonantData or vowelData
    switch (topicType) {
      case 'consonant':
        data = consonantData;
        break;
      case 'vowel':
        data = vowelData;
        break;
      default:
        data = consonantData;
        break;
    }
    // If questionNum is not 0 and less than data length
    if (questionNum && questionNum < data.length) {
      this.list = [...data];
      this.initList = this.pickWords(questionNum);
    } else {
      this.initList = [...data];
    }
    // Complete the initList and set to list
    this.list = [...this.initList];
    // Start the first question
    document.getElementById('btn-next').click();
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

  // Insert the word to randomList for displaying the answers
  insertRandomList(letter, meaning, letterClass) {
    this.randomList.push([letter, meaning, letterClass]);
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
    if (this.getTopicType() === 'vowel') {
      table += '<thead><tr><th>#</th><th>Alphabet</th><th>Pronunciation</th></tr></thead>';
    } else {
      table += '<thead><tr><th>#</th><th>Alphabet</th><th>Class</th><th>Name Meaning</th></tr></thead>';
    }
    table += '<tbody>';
    for (let i = 0; i < list.length; i++) {
      let num = i + 1;
      table += '<tr>';
      table += '<td>' + num + '</td>';
      // If topic type is vowel, then display the letter 'อ' with black color and the rest with red color
      if (this.getTopicType() === 'vowel') {
        table += '<td style="color: red;">' + list[i][0].replace('อ', '<span style="color: black;">อ</span>') + '</td>';
        table += '<td>' + list[i][1] + ' ' + list[i][2] + '</td>';
      } else {
        table += '<td>' + list[i][0] + '</td>';
        table += '<td>' + list[i][2] + '</td>';
        table += '<td>' + list[i][1] + '</td>';
      }
      table += '</tr>';
    }
    table += '</tbody>';
    table += '</table>';
    document.getElementById('list').innerHTML = table;
  }

  setTopicType(topicType) {
    this.topicType = topicType;
  }
  getTopicType() {
    return this.topicType;
  }
  setQuizTypeIndex(quizTypeIndex) {
    this.quizTypeIndex = quizTypeIndex;
  }
  getQuizTypeIndex() {
    return this.quizTypeIndex;
  }
  // So far, the following functions are not used
  /*
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
  */
}

const thai = new Thai();

// Initialize the list when refreshing the page or changing the select options
function init() {
  console.log('init');
  thai.init();
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

  // Get the value from select option
  const quizType = thai.getQuizTypeIndex();
  const topicType = thai.getTopicType();

  // Create card and display
  let card = '<div class="card" style="width: 19rem; ">';
  card += '<div class="card-body">';
  // If word[quizType] includes the letter 'อ', then display the letter 'อ' with black color and the rest with red color
  if (topicType === 'vowel' && word[quizType].includes('อ')) {
    const index = word[quizType].indexOf('อ');
    card += '<span class="card-text" style="color: red;">' + word[quizType].slice(0, index) + '</span>';
    card += '<span class="card-text" style="color: black;">' + word[quizType].slice(index, index + 1) + '</span>';
    card += '<span class="card-text" style="color: red;">' + word[quizType].slice(index + 1) + '</span>';
  } else {
    card += '<p class="card-text">' + word[quizType] + '</p>';
  }
  card += '</div>';
  card += '</div>';

  document.getElementById('list').innerHTML = card;
}

// Show the answers when clicking the answer button
function showAnswer() {
  document.getElementById('description').innerHTML = 'Answers';
  thai.showList(1);
}

// DOM behavior when operating the page

document.getElementById('btn-next').addEventListener('click', randomDisplayOneWord);
document.getElementById('btn-answer').addEventListener('click', showAnswer);

// Initialize when reload window
window.onload = function () {
  init();
}

// Initialize when restart or change the select option
document.getElementById('btn-restart').addEventListener('click', init);
document.getElementById('select-question-num').addEventListener('change', init);
document.getElementById('select-quiz-type').addEventListener('change', function () {
  thai.setQuizTypeIndex(document.getElementById('select-quiz-type').value);
  init();
});
document.getElementById('select-topic-type').addEventListener('change', function () {
  thai.setTopicType(document.getElementById('select-topic-type').value);
  // If the topic type is 'vowel', modify the quiz type option 2 setting value equal to 'pronunciation' and display 'Pronunciation' in the option
  if (thai.getTopicType() === 'vowel') {
    document.getElementById('select-quiz-type').options[1].text = 'Pronunciation';
  }
  // Else if the topic type is 'consonant', modify the quiz type option 2 setting value equal to 'meaning' and display 'Name Meaning' in the option
  else if (thai.getTopicType() === 'consonant') {
    document.getElementById('select-quiz-type').options[1].text = 'Name Meaning';
  }

  init();
});

// Press space to click next button
document.onkeydown = function (e) {
  // prevent default action
  if (e.code == 'Space') {
    e.preventDefault();
    document.getElementById('btn-next').click();
  }
}