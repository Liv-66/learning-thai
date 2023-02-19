class Thai {
  constructor() {
    this.initList = [];
    this.list = [];
    this.randomList = [];
    this.topicType = 'consonant';
    this.quizTypeIndex = 0;
    this.consonantData = [];
    this.vowelData = [];
    this.alreadyGetData = false;
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

  // Call server /api/quiz to get quiz data
  async getQuizData() {
    const response = await fetch('/api/quiz');
    const data = await response.json();
    this.consonantData = data.consonantData;
    this.vowelData = data.vowelData;
    this.vocabularies = data.vocabularies;
    console.log('vocabularies: ', data.vocabularies);
  };

  async init() {
    const questionNum = parseInt(document.getElementById('select-question-num').value);
    const topicType = this.getTopicType();
    if (!this.alreadyGetData) {
      await this.getQuizData();
      this.alreadyGetData = true;
    }

    let data;
    this.restart('init');
    // Refer to consonantData or vowelData
    switch (topicType) {
      case 'consonant':
        data = this.consonantData;
        break;
      case 'vowel':
        data = this.vowelData;
        break;
      default:
        data = this.consonantData;
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

  // Send data in req.body to server
  async addVocab(thai, meaning) {
    const data = { thai, meaning };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await fetch('/api/vocabularies', options);

    if (response.ok) {
      // Trigger alert-success to show the message
      // and disappear after 1 seconds
      document.getElementById('alert-success').style.display = 'block';
      // Replace the text in the alert-success
      document.getElementById('alert-success').textContent = thai + ' - ' + meaning;
      setTimeout(() => {
        document.getElementById('alert-success').style.display = 'none';
      }, 1000);
    } else {
      alert('Error: ' + response.statusText);
    }
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

// Press btn-add-vocab to add the word to the vocabulary list
document.getElementById('btn-add-vocab').addEventListener('click', function () {
  // Pass the vocab-thai, vocab-meaning of the submitted form to the addVocab function
  thai.addVocab(
    document.getElementById('vocab-thai').value,
    document.getElementById('vocab-meaning').value,
  );
});