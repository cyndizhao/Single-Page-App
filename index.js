
const DOMAIN = 'http://localhost:3000';
const API_TOKEN = 'kYTbOIHpxYG1bTF3290ec2iSqN68ENZEMPP76NjzOzk';


// getQuestions makes a request to our Rails API backend
// and returns an array of questions in a promise
function getQuestions () {
  return fetch(`${DOMAIN}/api/v1/questions?api_token=${API_TOKEN}`)
    .then(function (res) { return res.json() });
}

// getQuestion makes request to our Rails API backend
// and returns a single question object in a promise of
// the given id
function getQuestion (id) {
  return fetch(`${DOMAIN}/api/v1/questions/${id}?api_token=${API_TOKEN}`)
    .then(function (res) { return res.json() });
}

//post function!!!
function postQuestion (questionParams) {
  return fetch(
    `${DOMAIN}/api/v1/questions?api_token=${API_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // {title: 'dasdas', body: 'dasdas'}
      // should look likeð
      // {question: {title: 'dasdadssa', body: 'dasdas'}}
      body: JSON.stringify({question: questionParams})
    }
  )
}

function renderQuestions (questions) {
  return questions.map(function (question) {
    return `
      <div class="question-summary">
        <a
          data-id=${question.id}
          href
          class="question-link">
            ${question.title}
        </a>
      </div>
    `
  }).join('');
}

function renderQuestion (question) {
  console.log(question);
  return `
    <button class="back">Back</button>
    <h1>${question.title}</h1>
    <p>${question.body}</p>
    <h4>Answers</h4>
    <ul class="answers-list">
      ${renderAnswers(question.answers)}
    </ul>
  `;
}

function renderAnswers (answers) {
  return answers.map(function (answer) {
    return `<li class="answer">${answer.body}</li>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  // We put our DOM queries inside a DOMContentLoaded event handler
  // because the queried nodes at likely not rendered yet.
  // JavaScript inside of a DOMContentLoaded event handler will
  // run once every HTML tag has been rendered by the browser
  const questionsList = document.querySelector('#questions-list');
  const questionDetails = document.querySelector('#question-details');
  const questionForm = document.querySelector('#question-form');

  function loadQuestions () {
    getQuestions()
    .then(renderQuestions)
    .then(function (html) { questionsList.innerHTML = html });
  }

  getQuestions()
    .then(renderQuestions)
    .then(function (html) { questionsList.innerHTML = html });

  questionsList.addEventListener('click', function (event) {
    const { target } = event;

    if (target.matches('.question-link')) {
      event.preventDefault();
      const questionId = target.getAttribute('data-id');

      getQuestion(questionId)
        .then(function (question) {
          questionDetails.innerHTML = renderQuestion(question);
          questionDetails.classList.remove('hidden');
          questionsList.classList.add('hidden');
        });
    }
  });

  questionDetails.addEventListener('click', function (event) {
    const { target } = event;

    if (target.matches('button.back')) {
      questionDetails.classList.add('hidden');
      questionsList.classList.remove('hidden');
    }
  });

//when submitting form!
  questionForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = event.currentTarget.querySelector('#title');
    const body = event.currentTarget.querySelector('#body');

    const fData = new FormData(event.currentTarget);

    postQuestion({title: fData.get('title'), body: fData.get('body')})
    .then(function () {
      loadQuestions();
      title.value = '';
      body.value = '';
    })
  })
});
