let studentsData = [];

async function fetchStudentData() {
    try {
        const response = await fetch('students.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        studentsData = await response.json();
        renderTable(studentsData);
    } catch (error) {
        console.error("Could not fetch student data:", error);
    }
}

function renderTable(data) {
    const studentTableBody = document.getElementById('studentTableBody');
    studentTableBody.innerHTML = '';
    data.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td><img src="${student.img_src}" alt="${student.first_name}" class="student-image">${student.first_name} ${student.last_name}</td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.marks}</td>
            <td>${student.passing ? 'Passing' : 'Failed'}</td>
            <td>${student.email}</td>
        `;
        studentTableBody.appendChild(row);
    });
}

function searchStudents() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = studentsData.filter(student => 
        student.first_name.toLowerCase().includes(searchTerm) ||
        student.last_name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredData);
}

const sortFunctions = {
    'sortAZ': (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    'sortZA': (a, b) => `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`),
    'sortByMarks': (a, b) => a.marks - b.marks,
    'sortByPassing': (a, b) => b.passing - a.passing,
    'sortByClass': (a, b) => a.class - b.class,
    'sortByGender': (a, b) => a.gender.localeCompare(b.gender)
};

function handleSort(sortType) {
    let sortedData = [...studentsData].sort(sortFunctions[sortType]);
    
    if (sortType === 'sortByPassing') {
        sortedData = sortedData.filter(student => student.passing);
    } else if (sortType === 'sortByGender') {
        const maleStudents = sortedData.filter(student => student.gender === 'Male');
        const femaleStudents = sortedData.filter(student => student.gender === 'Female');
        renderTable(femaleStudents);
        renderTable(maleStudents);
        return;
    }
    
    renderTable(sortedData);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchStudentData();

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const sortButtons = document.querySelectorAll('.sort-buttons button');

    searchInput.addEventListener('input', searchStudents);
    searchButton.addEventListener('click', searchStudents);

    sortButtons.forEach(button => {
        button.addEventListener('click', () => handleSort(button.id));
    });
});