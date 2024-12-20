"use client"
import { Button } from "../ui/button";

const logoutHandler = async () => {
  try {
    const response = await fetch(`/api/auth/logout`);
  } catch (error) {
    alert("couldn't logout the user");
  }
};

export default function LogOutButton() {
  return <Button onClick={logoutHandler}>Log Out</Button>;
}
