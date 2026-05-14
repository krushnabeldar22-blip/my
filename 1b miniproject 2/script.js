const STORAGE_KEY = 'examRegistrationData';

const form = document.getElementById('registrationForm');
const studentName = document.getElementById('studentName');
const studentEmail = document.getElementById('studentEmail');
const studentGrade = document.getElementById('studentGrade');
const studentExam = document.getElementById('studentExam');
const examDate = document.getElementById('examDate');
const statusMessage = document.getElementById('statusMessage');

let students = [];

function fakeAjaxPost(url, payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.05;
      if (success) {
        resolve({ id: Date.now(), ...payload });
      } else {
        reject(new Error('Network error'));
      }
    }, 700);
  });
}

function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    students = [];
    return;
  }

  try {
    students = JSON.parse(saved);
  } catch (error) {
    students = [];
    console.warn('Unable to parse saved student data.', error);
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

function resetForm() {
  form.reset();
  const today = new Date().toISOString().slice(0, 10);
  examDate.value = today;
  studentName.focus();
}

function handleSubmit(event) {
  event.preventDefault();

  const payload = {
    name: studentName.value.trim(),
    email: studentEmail.value.trim(),
    grade: studentGrade.value.trim(),
    exam: studentExam.value,
    date: examDate.value,
  };

  if (!payload.name || !payload.email || !payload.grade || !payload.exam || !payload.date) {
    showStatus('Please fill out every field before submitting.', 'error');
    return;
  }

  showStatus('Submitting registration…', 'info');
  form.querySelector('button[type="submit"]').disabled = true;

  fakeAjaxPost('/register', payload)
    .then((student) => {
      students.unshift(student);
      saveStudents();
      resetForm();
      showStatus('Student registered successfully.', 'success');
    })
    .catch(() => {
      showStatus('Registration failed. Please try again.', 'error');
    })
    .finally(() => {
      form.querySelector('button[type="submit"]').disabled = false;
    });
}

function initialize() {
  const today = new Date().toISOString().slice(0, 10);
  examDate.value = today;
  loadStudents();
  form.addEventListener('submit', handleSubmit);
}

initialize();
