"use strict";

window.addEventListener("DOMContentLoaded", start);
let allStudents = [];
let filterBy = "all";
const settings = {
    filter: "all",
    sortBy: "firstname",
    sortDir: "asc"
}
//prototype
const Student = {
    firstname: "",
    lastname: "",
    middlename: "",
    nickname: "",
    house: "",
    bloodStatus: "",
    prefect: "",
    inquisitorial: "",
    expelled: ""
}

let halfBlood = [];
let pureBlood = [];

let loadedJson = 0;

let gryffindorCounter = 0;
let hufflepuffCounter = 0;
let ravenclawCounter = 0;
let slytherinCounter = 0;

function start() {
    console.log("start");
    loadJSON("https://petlatkea.dk/2020/hogwarts/students.json", prepareObjects);
    loadJSON("https://petlatkea.dk/2020/hogwarts/families.json", prepareBloodstatus);

    registerButtons();
    registerSearch();
}

function loadJSON(url, callback) {
    fetch(url).then(i => i.json()).then(callback);
}

function prepareBloodstatus(jsonBloodstatus) {
    halfBlood = jsonBloodstatus.half;
    pureBlood = jsonBloodstatus.pure;
    loadedJson++;
    if (loadedJson === 2) {
        compareBloodstatus();
        houseCounter();
        buildList();
    }
}

function compareBloodstatus() {
    allStudents.forEach(student => {
        if (halfBlood.includes(student.lastname)) {
            console.log("reee");
            student.bloodStatus = "Half-blood";
        } else if (pureBlood.includes(student.lastname)) {
            student.bloodStatus = "Pure-blood";
        } else {
            student.bloodStatus = "Muggle born";
        }
    });
    console.log(allStudents)
}

function prepareObjects(jsonData) {

    allStudents = jsonData.map(prepareObject);
    loadedJson++;
    if (loadedJson === 2) {
        compareBloodstatus();
        houseCounter();
        buildList();
    }

}

function prepareObject(jsonObject) {
    const student = Object.create(Student);

    let fullname = jsonObject.fullname.trim();
    fullname = fixName(fullname);

    const firstSpace = fullname.indexOf(" ");
    const lastSpace = fullname.lastIndexOf(" ");
    student.firstname = fullname.substring(0, firstSpace);
    student.lastname = fullname.substring(lastSpace + 1);
    student.middlename = fullname.substring(firstSpace, lastSpace);
    if (student.middlename.includes("\"") === true) {
        student.nickname = student.middlename.replaceAll("\"", "").trim();
        student.nickname = student.nickname.substring(0, 1).toUpperCase() + student.nickname.substring(1);
        student.middlename = "\n";
    }
    if (firstSpace === -1) {
        student.firstname = fullname;
        student.lastname = "";
    }
    student.house = jsonObject.house.trim().capitalize();


    student.prefect = "n/a";
    student.inquisitorial = "n/a";
    student.expelled = "n/a";


    return student;
}

function houseCounter() {
    allStudents.forEach(student => {
        if (student.house === "Gryffindor") {
            gryffindorCounter++;
        }
        if (student.house === "Hufflepuff") {
            hufflepuffCounter++;
        }
        if (student.house === "Ravenclaw") {
            ravenclawCounter++;
        }
        if (student.house === "Slytherin") {
            slytherinCounter++;
        }
    });
}

function buildList() {
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);
    displayCounters(sortedList);
    displayList(sortedList);
}

function displayList(students) {
    document.querySelector("#list tbody").innerHTML = "";

    if (students.length === 1) {
        document.querySelector("#student_count").innerHTML = "Currently showing " + students.length + " student";
    } else {
        document.querySelector("#student_count").innerHTML = "Currently showing " + students.length + " students";
    }
    if (students.length === undefined) {
        document.querySelector("#student_count").innerHTML = "Currently showing 0 students";
    }

    students.forEach(displayStudent);
}

function displayCounters() {
    document.querySelector("#students_gryffindor").innerHTML = "Students in Gryffindor: " + gryffindorCounter;
    document.querySelector("#students_hufflepuff").innerHTML = "Students in Hufflepuff: " + hufflepuffCounter;
    document.querySelector("#students_ravenclaw").innerHTML = "Students in Ravenclaw: " + ravenclawCounter;
    document.querySelector("#students_slytherin").innerHTML = "Students in Slytherin: " + slytherinCounter;

    document.querySelector("#total_students").innerHTML = "Total students: " + allStudents.length;

}

function displayStudent(student) {
    const clone = document.querySelector("template#student").content.cloneNode(true);

    clone.querySelector("[data-field=firstname]").textContent = student.firstname;
    clone.querySelector("[data-field=lastname]").textContent = student.lastname;
    clone.querySelector("[data-field=middlename]").textContent = student.middlename;
    clone.querySelector("[data-field=nickname]").textContent = student.nickname;
    clone.querySelector("[data-field=house]").textContent = student.house;
    clone.querySelector("[data-field=bloodStatus]").textContent = student.bloodStatus;

    clone.querySelector("tr").addEventListener("click", function () {
        showDetail(student);
    });

    document.querySelector("#list tbody").appendChild(clone);
}

function showDetail(student) {
    console.log(student);
    document.querySelector("#detail").classList.remove("hide");

    document.querySelector("#detail_info p:nth-child(1)").innerHTML = "First name: " + student.firstname;
    document.querySelector("#detail_info p:nth-child(2)").innerHTML = "Last name: " + student.lastname;
    document.querySelector("#detail_info p:nth-child(3)").innerHTML = "Middle name: " + student.middlename;
    document.querySelector("#detail_info p:nth-child(4)").innerHTML = "Nickname: " + student.nickname;
    document.querySelector("#detail_info p:nth-child(5)").innerHTML = "House: " + student.house;
    document.querySelector("#detail_info p:nth-child(6)").innerHTML = "Blood-status: " + student.bloodStatus;
    document.querySelector("#detail_img #picture").src = "../img2/slytherin_crest.png";
    document.querySelector("#detail_img #crest").innerHTML = "Blood-status: " + student.bloodStatus;

}

function fixName(fullname) {
    let capLetters = fullname[0].toUpperCase();
    for (let i = 1; i <= fullname.length - 1; i++) {
        let currentLetter, previousLetter = fullname[i - 1];
        if (previousLetter && previousLetter == " " || previousLetter && previousLetter == "-") {
            currentLetter = fullname[i].toUpperCase();
        } else {
            currentLetter = fullname[i].toLowerCase();
        }
        capLetters = capLetters + currentLetter;
    }
    fullname = capLetters;
    console.log(fullname);
    return fullname;
}

function getMiddleName(fullname) {
    const firstSpace = fullname.indexOf(" ");
    const lastSpace = fullname.lastIndexOf(" ");

    student.middlename = fullname.substring(firstSpace, lastSpace);
    if (student.middlename.includes("\"") === true) {
        student.nickname = student.middlename.replaceAll("\"", "").trim();
        student.nickname = student.nickname.substring(0, 1).toUpperCase() + student.nickname.substring(1);

        student.middlename = "\n";

    } else if (student.middlename === "") {
        student.middlename = "\n";
    } else {
        student.middlename = fullname.substring(firstSpace + 1, firstSpace + 2).toUpperCase() + fullname.substring(firstSpace + 2, lastSpace);
    }
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}


function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log("user selected " + filter);
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
    if (settings.filterBy === "gryffindor") {
        filteredList = allStudents.filter(isGryffindor);
    }
    if (settings.filterBy === "slytherin") {
        filteredList = allStudents.filter(isSlytherin);
    }
    if (settings.filterBy === "hufflepuff") {
        filteredList = allStudents.filter(isHufflepuff);
    }
    if (settings.filterBy === "ravenclaw") {
        filteredList = allStudents.filter(isRavenclaw);
    }
    if (settings.filterBy === "prefect") {
        filteredList = allStudents.filter(isPrefect);
    }
    if (settings.filterBy === "expelled") {
        filteredList = allStudents.filter(isExpelled);
    }
    if (settings.filterBy === "inquisitorial") {
        filteredList = allStudents.filter(isInquisitorial);
    }
    return filteredList;
}

function isGryffindor(student) {
    return student.house === "Gryffindor";
}

function isSlytherin(student) {
    return student.house === "Slytherin";
}

function isHufflepuff(student) {
    return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
    return student.house === "Ravenclaw";
}

function isPrefect(student) {
    return student.prefect === true;
}

function isExpelled(student) {
    return student.expelled === true;
}

function isInquisitorial(student) {
    return student.inquisitorial === false;
}

function registerButtons() {
    //filter btns
    document.querySelectorAll("[data-action='filter']").forEach(button => button.addEventListener("click", selectFilter));
    document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSort));
}

function registerSearch() {
    document.querySelector("#search-text").addEventListener("input", search);
}

function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
    console.log(settings.sortBy);


    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    oldElement.classList.remove("sort_by");

    event.target.classList.add("sort_by");

    console.log(sortBy);
    console.log("her" + oldElement);

    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }

    console.log("user selected " + sortBy);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function sortList(sortedList) {
    let direction = 1;
    if (settings.sortDir === "desc") {
        direction = -1;
    } else {
        settings.direction = 1;
    }

    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    return sortedList;
}

function search(filteredList) {
    const searchText = document.querySelector("#search-text").value.toLowerCase();

    allStudents.forEach(student => {
        if (student.firstname.toLowerCase().includes(searchText) || student.middlename.toLowerCase().includes(searchText) || student.lastname.toLowerCase().includes(searchText) || student.nickname.toLowerCase().includes(searchText)) {
            filteredList = allStudents.filter(containsText);
        }
    })

    function containsText(student) {
        if (student.firstname.toLowerCase().includes(searchText)) {
            return student.firstname.toLowerCase().includes(searchText);
        }
        if (student.middlename.toLowerCase().includes(searchText)) {
            return student.middlename.toLowerCase().includes(searchText);
        }
        if (student.lastname.toLowerCase().includes(searchText)) {
            return student.lastname.toLowerCase().includes(searchText);
        }
        if (student.nickname.toLowerCase().includes(searchText)) {
            return student.nickname.toLowerCase().includes(searchText);
        }
    }

    displayList(filteredList);
}