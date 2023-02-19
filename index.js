const express = require('express');
const { readFileSync } = require('fs');
const handlebars = require('handlebars');

const app = express();
// Serve the files in /assets at the URI /assets.
app.use('/assets', express.static('assets'));

// The HTML content is produced by rendering a handlebars template.
// The template values are stored in global state for reuse.
const data = {
  service: process.env.K_SERVICE || '???',
  revision: process.env.K_REVISION || '???',
};
let template;

app.get('/', async (req, res) => {
  // The handlebars template is stored in global state so this will only once.
  if (!template) {
    // Load Handlebars template from filesystem and compile for use.
    try {
      template = handlebars.compile(readFileSync('index.html.hbs', 'utf8'));
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Server Error');
    }
  }

  // Apply the template to the parameters to generate an HTML string.
  try {
    const output = template(data);
    res.status(200).send(output);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

// Called from front end to get quiz data
app.get('/api/quiz', async (req, res) => {
  const consonantData = [['ก', 'chicken', 'M'], ['ข', 'egg', 'H'], ['ฃ', 'bottle', 'H'], ['ค', 'buffalo', 'L'], ['ฅ', 'person', 'L'], ['ฆ', 'bell', 'L'], ['ง', 'snake', 'L'], ['จ', 'plate_dish', 'M'], ['ฉ', 'cymbal', 'H'], ['ช', 'elephant', 'L'], ['ซ', 'chain', 'L'], ['ฌ', 'tree', 'L'], ['ญ', 'woman', 'L'], ['ฎ', 'headdress', 'M'], ['ฏ', 'goad', 'M'], ['ฐ', 'base', 'H'], ['ฑ', 'actress_name', 'L'], ['ฒ', 'old_person', 'L'], ['ณ', 'novice monk', 'L'], ['ด', 'child', 'M'], ['ต', 'turtle', 'M'], ['ถ', 'bag_sack', 'H'], ['ท', 'solider', 'L'], ['ธ', 'flag', 'L'], ['น', 'mouse', 'L'], ['บ', 'leaf', 'M'], ['ป', 'fish', 'M'], ['ผ', 'bee', 'H'], ['ฝ', 'lid', 'H'], ['พ', 'kind_of_tray', 'L'], ['ฟ', 'tooth_teeth', 'L'], ['ภ', 'sailboat', 'L'], ['ม', 'horse', 'L'], ['ย', 'ogre', 'L'], ['ร', 'boat', 'L'], ['ล', 'monkey', 'L'], ['ว', 'ring', 'L'], ['ศ', 'pavilion', 'H'], ['ษ', 'hermit', 'H'], ['ส', 'tiger', 'H'], ['ห', 'chest', 'H'], ['ฬ', 'kind_of_kite', 'L'], ['อ', 'basin', 'S'], ['ฮ', 'owl', 'L']];
  const vowelData = [['อะ', 'a', '[a]'], ['อา', 'aa', '[aː]'], ['อิ', 'i', '[i]'], ['อี', 'ii', '[iː]'], ['อึ', 'ue', '[ɯ]'], ['อื', 'uee', '[ɯː]'], ['อุ', 'u', '[u]'], ['อู', 'uu', '[uː]'], ['เอะ', 'e', '[e]'], ['เอ', 'ay', '[eː]'], ['เเอะ', 'ae’', '[ɛ]'], ['เเอ', 'ae', '[ɛː]'], ['โอะ', 'o', '[o]'], ['โอ', 'oh', '[oː]'], ['เอาะ', 'or’', '[ɔ]'], ['ออ', 'or', '[ɔː]'], ['เออะ', 'oe’', '[ɤ]'], ['เออ', 'oe', '[ɤː]'], ['เอียะ', 'ia’', '[ia]'], ['เอีย', 'ia', '[iaː]'], ['เอือะ', 'uea’', '[ɯa]'], ['เอือ', 'uea', '[ɯaː]'], ['อัวะ', 'ua’', '[ua]'], ['อัว', 'ua', '[uaː]'], ['อ ํา', 'am', '[am]'], ['เอา', 'ao', '[ao]'], ['ไอ', 'ai', '[ai]'], ['ใอ', 'ai', '[ai]'], ['ไอย', 'ai', '[ai]'], ['อัย', 'ai', '[ai]'], ['ฤ', 'rue', '[rue]'], ['ฤๅ', 'ruee', '[rueː]'], ['ฦ', 'lue', '[lue]'], ['ฦๅ', 'luee', '[lueː]']];

  let data = {
    consonantData,
    vowelData
  };
  res.status(200).send(data);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});