//import Cookies from 'js-cookie';
// import Cookies from 'js-cookie';


var selectedRecord = null;
var selectedRecordID = null;
var baseUrl = "https://bookclubapi-serge.herokuapp.com";

// Get cookie
function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            console.log('cookie:'+ decodeURIComponent(cookiePair[1]))
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}


//-----------------------------------------------Beginning of user Router-----------------------------------

// User Login
function userLogin(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/users/signin",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            var data = response.user;
            console.log(data);

            console.log("token:" + response.token);
    
            document.cookie =  'authToken=' + response.token
            window.location.href = "./home.html";
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            Authorization: getCookie('authToken')
        }
       
        
    });
}

function onLoginDetailsSubmit() {
    var formData = {};
    formData["Email"] = document.getElementById("Email").value;
    formData["Password"] = document.getElementById("Password").value;
    
    userLogin(formData);
}

// User sign-Up (Create User)
function addUserRecordToTable(data) {
    var allus = document.getElementById("allus").getElementsByTagName("tbody")[0];
    var newRecord =allus.insertRow(allus.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.UserID;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.UserName;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.Email;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.createdAt;
    var cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.updatedAt;
    var cell6 = newRecord.insertCell(5);
    cell6.innerHTML = '<a onclick="onUserEdit(this)">Edit</a> <a onClick="onUserDelete(this)">Delete</a>';   
}

function addUser(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/users/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            var data = response.data;
            console.log(data);
            addUserRecordToTable(data);
            window.location.href = "./index.html";
            
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            Authorization: getCookie('authToken')
        }
       
        
    });
}

function onUserDetailsSubmit() {
  console.log("Function called : add user");
  document.getElementById("loginbox").style.display = "none";
    var formData = {};
    formData["Email"] = document.getElementById("Email").value;
    formData["UserName"] = document.getElementById("UserName").value;
    formData["Password"] = document.getElementById("Password").value;
    
    if (selectedRecord == null) {
        addUser(formData);
    } else {
        updateUserRecord(formData);
    }
    // alert("User Edited Successfully");
    clearUserForm();

}

function onUserDetailsSubmitTwo() {
    var formData = {};
    formData["Email"] = document.getElementById("Email").value;
    formData["UserName"] = document.getElementById("UserName").value;
    formData["Password"] = document.getElementById("Password").value;
    addUser(formData);
    window.location.href = "./index.html";
    clearUserForm();

}

// Get all users
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/users/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((user) => {
                addUserRecordToTable(user);
            });
        },
        headers:{
            Authorization: `token ${getCookie('authToken')}`
        }
    });
});

// View one User
function onUserIdSubmit() {
    var pid = document.getElementById("Userid").value;
    viewOneUser(pid);

}

function viewOneUser(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/users/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#allus tbody tr").remove();
            var data = response.data;
            data.forEach((user) => {
                addUserRecordToTable(user);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

// Updating a user
function onUserEdit(td) {
    document.getElementById("loginbox").style.display = "block";
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("Email").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("UserName").value = selectedRecord.cells[2].innerHTML;
   
}

function updateUserTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.Email;
    selectedRecord.cells[2].innerHTML = data.UserName;
    }


function updateUserRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/users/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updateUserTableRecord(data);
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function onUserDelete(td) {
    if (confirm('Are you sure you want to delete this record')) {
        var row = td.parentElement.parentElement;
        deleteUserData(row);
        
        
    }

}

function deleteUserData(row){
    $.ajax({
        type: "DELETE",
        url: baseUrl + "/users/" + row.cells[0].innerHTML,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(selectedRecordID);
        },
        headers:{
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function clearUserForm() {
    document.getElementById("Email").value = "";
    document.getElementById("UserName").value = "";
    
}

//--------------------------------------End of users router ---------------------------------------------------------
//--------------------------------------Beginning of members router--------------------------------------------------
// Add member
function addMemberRecordToTable(data) {
    var memberslist = document.getElementById("memberslist").getElementsByTagName("tbody")[0];
    var newRecord =memberslist.insertRow(memberslist.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.member_id;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.member_name;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.email_address;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.telephone;
    var cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.member_gender;
    var cell6 = newRecord.insertCell(5);
    cell6.innerHTML = data.date_of_birth;
    var cell7 = newRecord.insertCell(6);
    cell7.innerHTML = data.address;
    var cell8 = newRecord.insertCell(7);
    cell8.innerHTML = data.referral_id;
   
    var cell9 = newRecord.insertCell(8);
    cell9.innerHTML = '<a onclick="showOne(this)">View</a> <a onclick="onMemberEdit(this)">Edit</a> <a onClick="onMemberDelete(this)">Delete</a>';   
}

function showOne(recordid){
    // take in ID
    // get /record/id from api    // create divs to show details
    $.ajax({
        type: "GET",
        url: baseUrl + "/members/" + recordid,
        cache: false,
        success: function (response) {
            console.log(response.data[0].Customerid);
            console.log(response.data[0].CustName);
            console.log(response.data[0].TelephoneNo);
            console.log(response.data[0].Email);
            window.location.href = "./clientview.html";
        }
    });
}
 
function onMemberFormSubmit() {
  console.log("Add member called");
    var formData = {};
    formData["MemberName"] = document.getElementById("MemberName").value;
    formData["Email"] = document.getElementById("Email").value;
    formData["Telephone"] = document.getElementById("Telephone").value;
    formData["Gender"] = document.getElementById("Gender").value;
    formData["dob"] = document.getElementById("dob").value;
    formData["address"] = document.getElementById("address").value;
    formData["referralid"] = document.getElementById("referralid").value;

    
    

    if (selectedRecord == null) {
        saveMemberFormData(formData);
        // alert("Client Added Successfully");
    } else {
        updateMemberFormRecord(formData);
        // alert("Client Edited Successfully");
    }
    clearMemberForm();
}

function onBillFormSubmit() {
    var formData = {};
    formData["PremiseId"] = document.getElementById("PremiseId").value;
    formData["UserID"] = document.getElementById("UserID").value;
    formData["Reading"] = document.getElementById("Reading").value;

    saveBillFormData(formData);

    clearBillForm();
}

function onPayFormSubmit() {
    var formData = {};
    formData["billid"] = document.getElementById("billid").value;
    formData["PaidAmount"] = document.getElementById("PaidAmount").value;

    savePayFormData(formData);

    clearPayForm();
}

// Adding a member
function saveBillFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/bills/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            alert("Bill generated successfully");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
          
        }
    });
}

// Adding a member
function savePayFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/payments/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            console.log("Paid");
            alert("Bill Payment Successful. Thank You");
            close();
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });
}

// Adding a member
function saveMemberFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/members/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            console.log(response.token);
            addMemberRecordToTable(response.data);
            alert("Member was added successfully ");
           
        }
        // headers:{
        //     Accept:"application/json; charset=utf-8",
        //     Content_Type:"application/json; charset=utf-8",
        //     'Access-Control-Allow-Credentials': true,
        //     Authorization: `token ${getCookie('authToken')}`
        // }
       
        
    });
}


// Getting all members
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/members/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((member) => {
                addMemberRecordToTable(member);
            });
        },
    });
});

// View one Member
function onMemberIdSubmit() {
    var pid = document.getElementById("Memberid").value;
    viewOneMember(pid);

}

function viewOneMember(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/members/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#memberslist tbody tr").remove();
            var data = response.data;
            data.forEach((Member) => {
                addMemberRecordToTable(Member);
            });
        },
    });

}

//Updating a member
function onMemberEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("MemberName").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("Email").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("Telephone").value = selectedRecord.cells[3].innerHTML;
    document.getElementById("Gender").value = selectedRecord.cells[4].innerHTML;
    document.getElementById("dob").value = selectedRecord.cells[5].innerHTML;
    document.getElementById("address").value = selectedRecord.cells[6].innerHTML;
    document.getElementById("referralid").value = selectedRecord.cells[7].innerHTML;
   
}

function updateMemberTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.MemberName;
    selectedRecord.cells[2].innerHTML = data.Email;
    selectedRecord.cells[3].innerHTML = data.Telephone;
    selectedRecord.cells[4].innerHTML = data.Gender;
    selectedRecord.cells[5].innerHTML = data.dob;
    selectedRecord.cells[6].innerHTML = data.address;
    selectedRecord.cells[7].innerHTML = data.referralid;
    }


function updateMemberFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/members/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updateMemberTableRecord(data);
            alert("Member record edited successfully");
        }
        // headers:{
        //     Accept:"application/json; charset=utf-8",
        //     Content_Type:"application/json; charset=utf-8",
        //     'Access-Control-Allow-Credentials': true
        //     // Authorization: `token ${getCookie('authToken')}`
        // }
    });

}

// Deleting a member
function onMemberDelete(td) {
    if (confirm('Are you sure you want to delete this record')) {
        var row = td.parentElement.parentElement;
        deleteMemberData(row);
        document.getElementById("memberslist").deleteRow(row.rowIndex);
    }

}

function deleteMemberData(row){
    $.ajax({
        type: "DELETE",
        url: baseUrl + "/members/" + row.cells[0].innerHTML,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(selectedRecordID);
        }
        // headers:{
        //     Authorization: `token ${getCookie('authToken')}`
        // }
    });

}

function clearMemberForm() {
    document.getElementById("MemberName").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("Telephone").value = "";
    document.getElementById("Gender").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("address").value = "";
    document.getElementById("referralid").value = "";
}

function clearBillForm() {
    document.getElementById("PremiseId").value = "";
    document.getElementById("UserID").value = "";
    document.getElementById("Reading").value = "";
}

function clearPayForm() {
    document.getElementById("billid").value = "";
    document.getElementById("PaidAmount").value = "";
}

//----------------------------------End of Members Router------------------------------

// Add Books

function addBookRecordToTable(data) {
    var bookslist = document.getElementById("allbooks").getElementsByTagName("tbody")[0];
    var newRecord =bookslist.insertRow(bookslist.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.book_id;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.title;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.author;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.isbn;
    var cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.copies;
    var cell6 = newRecord.insertCell(5);
    cell6.innerHTML = data.genre;
    var cell7 = newRecord.insertCell(6);
    cell7.innerHTML = data.publication_date;
    var cell8 = newRecord.insertCell(7);
    cell8.innerHTML = '<a onclick="onBookEdit(this)">Edit</a> <a onClick="onBookDelete(this)">Delete</a>';   
}

// Submitting the book form records

function onBookFormSubmit() {
    var formData = {};
    formData["title"] = document.getElementById("title").value;
    formData["author"] = document.getElementById("author").value;
    formData["isbn"] = document.getElementById("isbn").value;
    formData["copies"] = document.getElementById("copies").value;
    formData["genre"] = document.getElementById("genre").value;
    formData["pdate"] = document.getElementById("pdate").value;
    

    if (selectedRecord == null) {
        saveBookFormData(formData);
        // alert("Premise Added Successfully");
    } else {
        updateBookFormRecord(formData);
        // alert("Premise Edited Successfully");
    }
    clearBookForm();
}

// Save form data

function saveBookFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/books/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            addBookRecordToTable(response.data);
            alert("Book added successfully");
            
        },
        // headers:{
        //     Accept:"application/json; charset=utf-8",
        //     Content_Type:"application/json; charset=utf-8",
            
        // }
       
        
    });
}

// Getting all Books
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/books/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((Book) => {
                addBookRecordToTable(Book);
            });
        },
        // headers: {
        //     Authorization: `token ${getCookie('authToken')}`
        // }
    });


});

// View one Book
function onBookIdInput() {
    var bid = document.getElementById("Bookid").value;
    viewOneBook(bid);

}

function viewOneBook(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/books/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#allbooks tbody tr").remove();
            var data = response.data;
            data.forEach((Book) => {
                addBookRecordToTable(Book);
            });
        },
        // headers: {
        //     Authorization: `token ${getCookie('authToken')}`
        // }
    });

}

// updating book

function onBookEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;

    document.getElementById("title").value = selectedRecord.cells[1].innerHTML
    document.getElementById("author").value = selectedRecord.cells[2].innerHTML
    document.getElementById("isbn").value = selectedRecord.cells[3].innerHTML

    document.getElementById("copies").value = selectedRecord.cells[4].innerHTML
    document.getElementById("genre").value = selectedRecord.cells[5].innerHTML
    document.getElementById("pdate").value = selectedRecord.cells[6].innerHTML
   
}

function updateBookTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.title;
    selectedRecord.cells[2].innerHTML = data.author;
    selectedRecord.cells[3].innerHTML = data.isbn;
    selectedRecord.cells[4].innerHTML = data.copies;
    selectedRecord.cells[5].innerHTML = data.genre;
    selectedRecord.cells[6].innerHTML = data.pdate;
 }


function updateBookFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/books/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updateBooksTableRecord(data);
            alert("Book edited successfully");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            
        }
    });

}

function onBookDelete(td) {
    if (confirm('Are you sure you want to delete this record')) {
        var row = td.parentElement.parentElement;
        deleteBookData(row);
        document.getElementById("allbooks").deleteRow(row.rowIndex);
    }

}

function deleteBookData(row){
    $.ajax({
        type: "DELETE",
        url: baseUrl + "/books/" + row.cells[0].innerHTML,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(selectedRecordID);
        },
        headers:{
            // Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function clearBookForm() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("copies").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("pdate").value = "";
}

// Borrow 

function addBorrowRecordToTable(data) {
    var bookslist = document.getElementById("allborrow").getElementsByTagName("tbody")[0];
    var newRecord =bookslist.insertRow(bookslist.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.borrow_id;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.book_id;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.member_id;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.borrow_date;
    var cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.return_date;
    var cell6 = newRecord.insertCell(5);
    cell6.innerHTML = data.status;
    var cell7 = newRecord.insertCell(7);
    cell7.innerHTML = '<a onclick="onBookEdit(this)">Edit</a> <a onClick="onBookDelete(this)">Delete</a>';   
}

// Submitting the book form records

function onBorrowFormSubmit() {
    var formData = {};
    formData["bookid"] = document.getElementById("bookid").value;
    formData["memberid"] = document.getElementById("memberid").value;
    formData["bdate"] = document.getElementById("bdate").value;
    formData["rdate"] = document.getElementById("rdate").value;
    formData["genre"] = document.getElementById("status").value;

    if (selectedRecord == null) {
        saveBookFormData(formData);
        // alert("Premise Added Successfully");
    } else {
        updateBookFormRecord(formData);
        // alert("Premise Edited Successfully");
    }
    clearBorrowForm();
}

// Save form data

function saveBorrowFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/borrow/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            addBookRecordToTable(response.data);
            alert("Borrow successfully");
            
        },
        // headers:{
        //     Accept:"application/json; charset=utf-8",
        //     Content_Type:"application/json; charset=utf-8",
            
        // }
       
        
    });
}

// Getting all Books
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/borrow/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((Borrow) => {
                addBorrowRecordToTable(Borrow);
            });
        },
        // headers: {
        //     Authorization: `token ${getCookie('authToken')}`
        // }
    });


});

// View one Book
function onBorrowIdInput() {
    var bid = document.getElementById("borrowid").value;
    viewOneBook(bid);

}

function viewOneBorrow(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/borrow/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#allborrow tbody tr").remove();
            var data = response.data;
            data.forEach((Borrow) => {
                addBorrowRecordToTable(Borrow);
            });
        },
        // headers: {
        //     Authorization: `token ${getCookie('authToken')}`
        // }
    });

}

// updating book

function onBorrowEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;

    document.getElementById("bookid").value = selectedRecord.cells[1].innerHTML
    document.getElementById("memberid").value = selectedRecord.cells[2].innerHTML
    document.getElementById("bdate").value = selectedRecord.cells[3].innerHTML

    document.getElementById("rdate").value = selectedRecord.cells[4].innerHTML
    document.getElementById("status").value = selectedRecord.cells[5].innerHTML
   
}

function updateBorrowTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.borrow_id;
    selectedRecord.cells[2].innerHTML = data.member_id;
    selectedRecord.cells[3].innerHTML = data.borrow_date;
    selectedRecord.cells[4].innerHTML = data.return_date;
    selectedRecord.cells[5].innerHTML = data.status;
 }


function updateBorrowFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/borrow/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updateBorrowTableRecord(data);
            alert("Borrowed edited successfully");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            
        }
    });

}

function onBorrowDelete(td) {
    if (confirm('Are you sure you want to delete this record')) {
        var row = td.parentElement.parentElement;
        deleteBorrowData(row);
        document.getElementById("allborrow").deleteRow(row.rowIndex);
    }

}

function deleteBorrowData(row){
    $.ajax({
        type: "DELETE",
        url: baseUrl + "/borrow/" + row.cells[0].innerHTML,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(selectedRecordID);
        },
        headers:{
            // Authorization: `token ${getCookie('authToken')}`
        }
    });

}



//----------------------------------Beginning of Premises Router----------------------- 
// Add Premise
function addPremiseRecordToTable(data) {
    var Premiseslist = document.getElementById("Premiseslist").getElementsByTagName("tbody")[0];
    var newRecord =Premiseslist.insertRow(Premiseslist.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.PremiseId;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.MeterNo;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.Customerid;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.Routeid;
    var cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.createdAt;
    var cell6 = newRecord.insertCell(5);
    cell6.innerHTML = data.updatedAt;
    var cell7 = newRecord.insertCell(6);
    cell7.innerHTML = '<a onclick="onPremiseEdit(this)">Edit</a>';   
}
 
function onPremiseFormSubmit() {
    var formData = {};
    formData["MeterNo"] = document.getElementById("MeterNo").value;
    formData["Customerid"] = document.getElementById("Customerid").value;
    formData["Routeid"] = document.getElementById("Routeid").value;
    

    if (selectedRecord == null) {
        savePremiseFormData(formData);
        // alert("Premise Added Successfully");
    } else {
        updatePremiseFormRecord(formData);
        // alert("Premise Edited Successfully");
    }
    clearPremiseForm();
}

// Adding a Premise
function savePremiseFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/premises/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            addPremiseRecordToTable(response.data);
            alert("Member Premise added successfully");
            
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
       
        
    });
}


// Getting all Premises
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((Premise) => {
                addPremiseRecordToTable(Premise);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });


});

// Getting all premises by a member
function onMemberIdInput() {
    var pid = document.getElementById("Clientid").value;
    sortByMember(pid);

}

function sortByMember(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises/member/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#Premiseslist tbody tr").remove();
            var data = response.data;
            data.forEach((Premise) => {
                addPremiseRecordToTable(Premise);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

// Getting all premises by route
function onRouteIdInput() {
    var pid = document.getElementById("Clientid").value;
    sortByRoute(pid);

}

function sortByRoute(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises/route/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#Premiseslist tbody tr").remove();
            var data = response.data;
            data.forEach((Premise) => {
                addPremiseRecordToTable(Premise);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

// View one Premise
function onPremiseIdInput() {
    var pid = document.getElementById("Clientid").value;
    viewOnePremise(pid);

}

function viewOnePremise(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises/" + id,
        cache: false,
        success: function (response) {
            console.log(response.message);
            console.log(id);
            $("#Premiseslist tbody tr").remove();
            var data = response.data;
            data.forEach((Premise) => {
                addPremiseRecordToTable(Premise);
            });
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

//Updating a Premise
function onPremiseEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("MeterNo").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("Customerid").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("Routeid").value = selectedRecord.cells[3].innerHTML;
   
}

function updatePremiseTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.MeterNo;
    selectedRecord.cells[2].innerHTML = data.Customerid;
    selectedRecord.cells[3].innerHTML = data.Routeid;
 }


function updatePremiseFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/premises/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updatePremiseTableRecord(data);
            alert("Member Premise edited successfully");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function clearPremiseForm() {
    document.getElementById("MeterNo").value = "";
    document.getElementById("Customerid").value = "";
    document.getElementById("Routeid").value = "";
    
}

//----------------------------------End of Premises Router-----------------------------

//---------------------------------Beginning of Routes Router---------------------------
// Add Route
function addRouteRecordToTable(data) {
    var Routeslist = document.getElementById("Routeslist").getElementsByTagName("tbody")[0];
    var newRecord =Routeslist.insertRow(Routeslist.length);

    var cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.Routeid;
    var cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.Route_name;
    var cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.Status;
    var cell4 = newRecord.insertCell(3);
    cell4.innerHTML = '<a onclick="onRouteEdit(this)">Edit</a>';   
}
 
function onRouteFormSubmit() {
    document.getElementById("Status").style.display = "none";
    var formData = {};
    formData["Route_name"] = document.getElementById("Route_name").value;

    if (selectedRecord == null) {
        saveRouteFormData(formData);
        // alert("Route Added Successfully");
    } else {
        formData["Status"] = document.getElementById("Status").value;
        updateRouteFormRecord(formData);
        // alert("Route Edited Successfully");
    }
    clearRouteForm();
}

// Adding a Route
function saveRouteFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/routes/",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (response) {
            addRouteRecordToTable(response.data);
            alert("Route Record Added Successfully");
            
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
       
        
    });
}


// Getting all Routes
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: baseUrl + "/routes/",
        cache: false,
        success: function (response) {
            var data = response.data;
            data.forEach((Route) => {
                addRouteRecordToTable(Route);
            });
        },
        headers:{
            Authorization: `token ${getCookie('authToken')}`
        }
    });
});


//Updating a Route
function onRouteEdit(td) {
    document.getElementById("Status").style.display = "block";
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("Route_name").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("Status").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("submit").value = "Update Route";
   
}

function updateRouteTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.Route_name;
    selectedRecord.cells[2].innerHTML = data.Status;
    }


function updateRouteFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/routes/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function () {
            updateRouteTableRecord(data);
            alert("Route Record Edited Successfully");
        },
        headers:{
            Accept:"application/json; charset=utf-8",
            Content_Type:"application/json; charset=utf-8",
            'Access-Control-Allow-Credentials': true,
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

function clearRouteForm() {
    document.getElementById("Route_name").value = "";
    document.getElementById("Status").value = "";
    
}

//---------------------------------End of Routes Router-------------------------------------------------

//-----------------------------------------------Beginning of Payments Router--------------------------------------------
// get all payments
$(document).ready(() => {
$.ajax({
    url: baseUrl + "/payments", 
    method: 'GET',
    dataType : 'json',
    success: function(data){
      if(data.data.length > 0){
        console.log("Fetched payments");
          for(let index = 0; index < data.data.length; index++) {
            var newRow = $("<tr>");
            var cols = "";
            var TransactionID = '';
            var billid = '';
            var PremiseId = '';
            var ExpectedAmount = '';
            var PaidAmount = '';
            var createdAt = '';
            var newExpected = numberWithCommas(data.data[index].ExpectedAmount);
            var newPaidAmount = numberWithCommas(data.data[index].PaidAmount);
            cols += '<td> '+ data.data[index].TransactionID +'</td>';
            cols += '<td> '+ data.data[index].billid +'</td>';
            cols += '<td> '+ data.data[index].PremiseId+'</td>';
            cols += '<td> '+ newExpected+'</td>';
            cols += '<td> '+ newPaidAmount+'</td>';
            cols += '<td> '+ data.data[index].createdAt+'</td>';
            newRow.append(cols);
            $("#allpa .tbody").append(newRow);
          }
    }
  }
})
})
//View Payment by Premise
function onPrIdInput() {
    var pid = document.getElementById("Prid").value;
    sortbyPremise(pid);

}

function sortbyPremise(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/payments/premise/" + id,
        cache: false,
        success: function (data) {
            console.log(id);
            $("#allpa tbody tr").remove();
            if(data.data.length > 0){
                console.log("Fetched payments");
                  for(let index = 0; index < data.data.length; index++) {
                    var newRow = $("<tr>");
                    var cols = "";
                    var TransactionID = '';
                    var billid = '';
                    var PremiseId = '';
                    var ExpectedAmount = '';
                    var PaidAmount = '';
                    var createdAt = '';
                    var newExpected = numberWithCommas(data.data[index].ExpectedAmount);
                    var newPaidAmount = numberWithCommas(data.data[index].PaidAmount);
                    cols += '<td> '+ data.data[index].TransactionID +'</td>';
                    cols += '<td> '+ data.data[index].billid +'</td>';
                    cols += '<td> '+ data.data[index].PremiseId+'</td>';
                    cols += '<td> '+ newExpected+'</td>';
                    cols += '<td> '+ newPaidAmount+'</td>';
                    cols += '<td> '+ data.data[index].createdAt+'</td>';
                    newRow.append(cols);
                    $("#allpa .tbody").append(newRow);
                  }
            }
            
            
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

//------------------------------------------End of Payments Router------------------------------------------------------
//------------------------------------------Beginning of Bills Router---------------------------------------------------
// Get all bills


$(document).ready(() => {
    $.ajax({
        url: baseUrl + "/bills/", 
        method: 'GET',
        dataType : 'json',
        success: function(data){
          if(data.data.length > 0){
            console.log("Fetched bills");
              for(let index = 0; index < data.data.length; index++) {
                var newRow = $("<tr>");
                var cols = "";
                var billid = '';
                var PremiseId = '';
                var UserID = '';
                var Reading = '';
                var Amount = '';
                var Status = '';
                var createdAt = '';
                var newAmount = numberWithCommas(data.data[index].Amount);
                cols += '<td> '+ data.data[index].billid +'</td>';
                cols += '<td> '+ data.data[index].PremiseId +'</td>';
                cols += '<td> '+ data.data[index].UserID+'</td>';
                cols += '<td> '+ data.data[index].Reading+'</td>';
                cols += '<td> '+ newAmount+'</td>';
                cols += '<td> '+ data.data[index].Status+'</td>';
                cols += '<td> '+ data.data[index].createdAt+'</td>';
                newRow.append(cols);
                $("#allbi .tbody").append(newRow);
              }
        }
      }
    })
    })

// Capture a Bill
// premise IDs for select - bills
$(document).ready(() => {
$.ajax({
    url: baseUrl + "/premises", 
    method: 'GET',
    dataType : 'json',
    success: function(data){
      if(data.data.length > 0){
        console.log("Fetched premises IDs");
          for(let index = 0; index < data.data.length; index++) {
            $('#PremiseID').append('<option name="PremiseId" value="' + data.data[index].PremiseId + '">' + data.data[index].PremiseId + '</option>');
          }
    }
  }
})
})

// biller IDs for select - bills
$(document).ready(() => {
$.ajax({
    url: baseUrl + "/users", 
    method: 'GET',
    dataType : 'json',
    success: function(data){
      if(data.data.length > 0){
        console.log("Fetched biller IDs");
          for(let index = 0; index < data.data.length; index++) {
            $('#UserID').append('<option value="' + data.data[index].UserID + '">' + data.data[index].UserID + '</option>');
          }
    }
  }
})
})

// thousand separator
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

//View a bill
function onBillIdInput() {
    var pid = document.getElementById("Billid").value;
    viewOneBill(pid);

}

function viewOneBill(id) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/bills/" + id,
        cache: false,
        success: function (data) {
            $("#allbi tbody tr").remove();
            if(data.data.length > 0){
                console.log("Fetched bills");
                  for(let index = 0; index < data.data.length; index++) {
                    var newRow = $("<tr>");
                    var cols = "";
                    var billid = '';
                    var PremiseId = '';
                    var UserID = '';
                    var Reading = '';
                    var Amount = '';
                    var Status = '';
                    var createdAt = '';
                    var newAmount = numberWithCommas(data.data[index].Amount);
                    cols += '<td> '+ data.data[index].billid +'</td>';
                    cols += '<td> '+ data.data[index].PremiseId +'</td>';
                    cols += '<td> '+ data.data[index].UserID+'</td>';
                    cols += '<td> '+ data.data[index].Reading+'</td>';
                    cols += '<td> '+ newAmount+'</td>';
                    cols += '<td> '+ data.data[index].Status+'</td>';
                    cols += '<td> '+ data.data[index].createdAt+'</td>';
                    newRow.append(cols);
                    $("#allbi .tbody").append(newRow);
                  }
            }
            
            
        },
        headers: {
            Authorization: `token ${getCookie('authToken')}`
        }
    });

}

//-----------------------------------------------End of Bills Router-----------------------------------------------------