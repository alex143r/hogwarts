"use strict";

window.addEventListener("DOMContentLoaded", start);
let allStudents = [];
let filterBy = "all";
const settings = {
    filter: "all",
    sortBy: "firstname",
    sortDir: "asc",
    hacked: false
}
//prototype
const Student = {
    fullname: "",
    firstname: "",
    lastname: "",
    middlename: "",
    nickname: "",
    house: "",
    bloodStatus: "",
    image: "",
    prefect: false,
    inquisitor: false,
    expelled: ""
}

let halfBlood = [];
let pureBlood = [];

let expelledStudents = [];


let gryffindorCounter = 0;
let hufflepuffCounter = 0;
let ravenclawCounter = 0;
let slytherinCounter = 0;

function start() {
    console.log("start");
    loadJSON("https://petlatkea.dk/2020/hogwarts/families.json", prepareBloodstatus);

    registerButtons();
    registerSearch();
    let qCount = 0;
    document.querySelector("#search-text").addEventListener("input", function () {
        if (this.input = "q") {
            qCount++;
        }
        if (qCount === 4) {
            hackTheSystem();
        }
    });
}

function loadJSON(url, callback) {
    fetch(url).then(i => i.json()).then(callback);
}

function prepareBloodstatus(jsonBloodstatus) {
    halfBlood = jsonBloodstatus.half;
    pureBlood = jsonBloodstatus.pure;
    loadJSON("https://petlatkea.dk/2020/hogwarts/students.json", prepareObjects);
}

function compareBloodstatus() {
    allStudents.forEach(student => {
        if (halfBlood.includes(student.lastname)) {
            student.bloodStatus = "Half-blood";
        } else if (pureBlood.includes(student.lastname)) {
            student.bloodStatus = "Pure-blood";
        } else {
            student.bloodStatus = "Muggle-born";
        }
    });
}

function prepareObjects(jsonData) {
    allStudents = jsonData.map(prepareObject);

    compareBloodstatus();
    houseCounter();
    buildList();
}

function prepareObject(jsonObject) {
    const student = Object.create(Student);

    let fullname = jsonObject.fullname.trim();
    student.fullname = fixName(fullname);

    const firstSpace = student.fullname.indexOf(" ");
    const lastSpace = student.fullname.lastIndexOf(" ");
    student.firstname = student.fullname.substring(0, firstSpace);
    student.lastname = student.fullname.substring(lastSpace + 1);
    student.middlename = student.fullname.substring(firstSpace, lastSpace);
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

    clone.querySelector("tr").addEventListener("click", function show() {
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
    if (student.cloakOfInvisibility === true) {
        document.querySelector("#picture").src = student.image;
    } else {
        document.querySelector("#picture").src = "img/" + getImage(student);
    }
    document.querySelector("#crest").src = "img2/" + student.house.toLowerCase() + "_crest.png";
    if (student.house === "Gryffindor") {
        document.querySelector("#detail_view").style.backgroundImage = "linear-gradient(to bottom left, red, black)";
    }
    if (student.house === "Hufflepuff") {
        document.querySelector("#detail_view").style.backgroundImage = "linear-gradient(to bottom left, yellow, black)";
    }
    if (student.house === "Ravenclaw") {
        document.querySelector("#detail_view").style.backgroundImage = "linear-gradient(to bottom left, #6381FC, black)";
    }
    if (student.house === "Slytherin") {
        document.querySelector("#detail_view").style.backgroundImage = "linear-gradient(to bottom left, green, black)";
    }


    if (student.inquisitor === true) {
        document.querySelector("#inquisitor_btn").innerHTML = "Student is a member of the inquisitorial squad";
    }
    if (student.inquisitor === false) {
        document.querySelector("#inquisitor_btn").innerHTML = "Make Inquisitor";
    }
    if (student.expelled === false) {
        document.querySelector("#expel_btn").innerHTML = "Expel";
    }
    if (student.expelled === true) {
        document.querySelector("#expel_btn").innerHTML = "EXPELLED";
    }



    if (student.prefect === true) {
        document.querySelector("#prefect_btn").innerHTML = "Is a prefect";
    }
    if (student.prefect === false) {
        document.querySelector("#prefect_btn").innerHTML = "Make prefect";
    }


    document.querySelector("#prefect_btn").addEventListener("click", makePrefect);

    function makePrefect() {
        let prefectCounter = 0;
        allStudents.forEach(s => {
            if (s.prefect === true && s.house === student.house) {
                prefectCounter++;
            }
        })
        if (student.prefect === true) {
            student.prefect === false;
        }
        if (prefectCounter < 2) {
            if (student.prefect === false) {
                student.prefect = true;
                document.querySelector("#prefect_btn").innerHTML = "Is a prefect";
            } else if (student.prefect === true) {
                student.prefect = false;
                document.querySelector("#prefect_btn").innerHTML = "Make prefect";
            }
        }
        if (prefectCounter === 2) {
            prefectError(student);

        }
        allStudents.forEach(s => {
            if (s.prefect === true) {}
        })
    }
    document.querySelector("#inquisitor_btn").addEventListener("click", makeInquisitor);

    function makeInquisitor() {
        if (student.bloodStatus === "Pure-blood" && student.house === "Slytherin" && student.inquisitor === false) {
            student.inquisitor = true;
            document.querySelector("#inquisitor_btn").innerHTML = "Student is a member of the inquisitorial squad";
            if (settings.hacked === true) {
                setTimeout(removeInquisitor, 1000);
            }
        } else if (student.inquisitor === true) {
            document.querySelector("#inquisitor_btn").innerHTML = "Make Inquisitor";
            student.inquisitor = false;

        } else {
            inquisitorError();

        }

        function removeInquisitor() {
            document.querySelector("#detail_view").classList.add("shake");
            document.querySelector("#inquisitor_btn").innerHTML = "Make Inquisitor";
            student.inquisitor = false;
            document.querySelector("#detail_view").addEventListener("animationend", function () {
                document.querySelector("#detail_view").classList.remove("shake");
            })
        }
    }

    document.querySelector("#detail_close").addEventListener("click", function () {
        document.querySelector("#detail").classList.add("hide");
        document.querySelector("#prefect_btn").removeEventListener("click", makePrefect);
        document.querySelector("#inquisitor_btn").removeEventListener("click", makeInquisitor);
        document.querySelector("#expel_btn").removeEventListener("click", expelStudent);

    });
    document.querySelector("#expel_btn").addEventListener("click", expelStudent);

    function expelStudent() {
        if (student.cloakOfInvisibility === true) {
            console.log("protego");
        } else if (student.house === "Gryffindor") {
            gryffindorCounter--;
        } else if (student.house === "Hufflepuff") {
            hufflepuffCounter--;
        } else if (student.house === "Ravenclaw") {
            ravenclawCounter--;
        } else if (student.house === "Slytherin") {
            slytherinCounter--;
        }
        if (student.cloakOfInvisibility === true) {
            console.log("protego");
        } else {
            student.expelled = true;
            expelledStudents.push(student);
            allStudents.splice(allStudents.indexOf(student), 1);
            buildList();
            document.querySelector("#expel_btn").innerHTML = "EXPELLED";
            document.querySelector("#expel_btn").removeEventListener("click", expelStudent);
            document.querySelector("#inquisitor_btn").removeEventListener("click", makeInquisitor);
            document.querySelector("#prefect_btn").removeEventListener("click", makePrefect);

        }
    }

    if (student.expelled === true) {
        document.querySelector("#prefect_btn").removeEventListener("click", makePrefect);
        document.querySelector("#inquisitor_btn").removeEventListener("click", makeInquisitor);
        document.querySelector("#expel_btn").removeEventListener("click", expelStudent);
        document.querySelector("#expel_btn").innerHTML = "EXPELLED";
    }
}

function prefectError(student) {
    document.querySelector("#not_prefect .dialogcontent h1").innerHTML = "Already 2 prefects in this house";
    document.querySelector("#not_prefect").classList.add("show");
    allStudents.forEach(s => {
        if (s.prefect === true && s.house === student.house) {
            const currentPrefect = document.createElement("p");
            currentPrefect.innerHTML = s.fullname;
            const removeBtn = document.createElement("button");
            removeBtn.innerHTML = "Remove";
            document.querySelector("#not_prefect .dialogcontent").appendChild(currentPrefect);
            document.querySelector("#not_prefect .dialogcontent").appendChild(removeBtn);
            removeBtn.addEventListener("click", function () {
                s.prefect = false;
                currentPrefect.classList.add("fade");
                removeBtn.classList.add("fade");
                currentPrefect.addEventListener("animationend", removePref);

                function removePref() {
                    currentPrefect.remove();
                    removeBtn.remove();
                    document.querySelector("#not_prefect .dialogcontent h1").innerHTML = "";

                }

            });
            document.querySelector("#not_prefect .closebutton").addEventListener("click", function () {
                document.querySelector("#not_prefect").classList.remove("show");
                currentPrefect.remove();
                removeBtn.remove();
            });

        }
    })

}

function inquisitorError() {
    document.querySelector("#not_inquisitor").classList.add("show");
    document.querySelector(".closebutton").addEventListener("click", function () {
        document.querySelector("#not_inquisitor").classList.remove("show");
    });

}

function getImage(student) {
    let imgCount = 0;

    allStudents.forEach(s => {
        if (student.lastname === s.lastname) {
            imgCount++;
        }
    });
    if (student.lastname.includes("-") == true) {

        let indexHyphen = student.lastname.indexOf("-");
        student.image = student.lastname.substring(indexHyphen + 1);
        student.image = student.image.toLowerCase() + "_" + student.fullname.split(' ')[0].substring(0, 1).toLowerCase() + ".png";

    } else {
        student.image = student.lastname.toLowerCase() + "_" + student.fullname.split(' ')[0].substring(0, 1).toLowerCase() + ".png";
    }
    if (imgCount === 2) {
        student.image = student.lastname.toLowerCase() + "_" + student.firstname.toLowerCase() + ".png";
    }
    return student.image;
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
    return fullname;
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
        filteredList = expelledStudents;
    }
    if (settings.filterBy === "inquisitor") {
        filteredList = allStudents.filter(isInquisitor);
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


function isInquisitor(student) {
    return student.inquisitor === true;
}

function registerButtons() {
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


function hackTheSystem() {
    settings.hacked = true;
    injectSelf();
    hackBloodStatus();
}

function injectSelf() {
    const student = Object.create(Student);
    student.firstname = "Alexander";
    student.lastname = "Tyllesen";
    student.middlename = "Obel";
    student.fullname = "Alexander Obel Tyllesen";
    student.house = "Hufflepuff";
    student.bloodStatus = "Half-Blood";
    student.image = "img2/me.jpg";
    student.cloakOfInvisibility = true;
    student.prefect = false;
    student.inquisitor = false;
    allStudents.push(student);
    hufflepuffCounter++;
    buildList();
    houseCounter();
}

function hackBloodStatus() {
    allStudents.forEach(student => {
        if (student.bloodStatus === "Pure-blood") {
            const values = ["Pure-blood", "Half-blood", "Muggle-born"]
            const random = Math.floor(Math.random() * values.length);
            student.bloodStatus = values[Math.floor(Math.random() * values.length)];
        }
    })
}