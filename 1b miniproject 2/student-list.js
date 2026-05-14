const STORAGE_KEY = 'examRegistrationData';
const studentTotal = document.getElementById('studentTotal');
const examTypesCount = document.getElementById('examTypesCount');
const latestStudent = document.getElementById('latestStudent');
const studentList = document.getElementById('studentList');
const clearButton = document.getElementById('clearButton');

let students = [];

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

function renderStudentList() {
  studentList.innerHTML = '';

  if (students.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No students registered yet.';
    studentList.appendChild(empty);
    studentTotal.textContent = '0';
    examTypesCount.textContent = '0';
    latestStudent.textContent = '—';
    return;
  }

  students.forEach((student) => {
    const card = document.createElement('article');
    card.className = 'student-card';
    card.innerHTML = `
      <strong>${student.name}</strong>
      <span>${student.email}</span>
      <div class="student-meta">
        <span>Grade: ${student.grade}</span>
        <span>Exam: ${student.exam}</span>
      </div>
      <span>Date: ${student.date}</span>
    `;
    studentList.appendChild(card);
  });

  const examTypes = new Set(students.map((student) => student.exam));
  studentTotal.textContent = `${students.length}`;
  examTypesCount.textContent = `${examTypes.size}`;
  latestStudent.textContent = students[0].name;
}

function handleClear() {
  if (!students.length) {
    return;
  }

  students = [];
  saveStudents();
  renderStudentList();
}

function initialize() {
  loadStudents();
  renderStudentList();
  clearButton.addEventListener('click', handleClear);
}

initialize();
