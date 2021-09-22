import React , { useEffect, useState } from 'react';

class UserData {
    userID;
}

let userData;
export function UpdateUserData(userID) {
    if (!userData) userData = new UserData();
    userData.userID = userID;
}
export function GetUserData(userID) {
    if (!userData) userData = new UserData();
    return userData
}
