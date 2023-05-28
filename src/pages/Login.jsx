import React from "react";
import "../style/login.scss";
import { useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import crypto, { HmacSHA256, SHA256 } from "crypto-js";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const loginEmailInput = useRef(); //email input
    const loginPwInput = useRef(); // pwd input

    // Password 암호화 작업 -> setPassword 에 암호화 된 password 세팅
    const onChangePwd = (e) => {
        setPassword(
            SHA256(
                e.target.value,
                process.env.REACT_APP_AES_SECRET_PASSWORD
            ).toString()
        );
    };
    const aes128Encode = (secretKey, Iv, data) => {
        const cipher = CryptoJS.AES.encrypt(
            data,
            CryptoJS.enc.Utf8.parse(secretKey),
            {
                iv: CryptoJS.enc.Utf8.parse(Iv), // [Enter IV (Optional) 지정 방식]
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC, // [cbc 모드 선택]
            }
        );
        return cipher.toString();
    };

    // Login button 눌렸을떄 setLogin 함수 호출.
    const setLogin = () => {
        if (!loginEmailInput.current.value || !loginPwInput.current.value) {
            return alert("값을 입력하세요");
        }
        var aes128SecretKey = process.env.REACT_APP_AES_SECRET_KEY; // key 값 16 바이트
        var aes128Iv = process.env.REACT_APP_AES_SECRET_IV; //iv 16 바이트
        // http://localhost:8080/login 으로 보내줌.
        axios.post(`/login`, {
            email: aes128Encode(
                aes128SecretKey,
                aes128Iv,
                loginEmailInput.current.value
            ),
            password: password,
        }).then(function(response) {
            if (response.data.status === "success") {
                //로컬 스토리지 저장해보기.
                sessionStorage.clear();
                sessionStorage.setItem("id", response.data.email);

                window.location.replace("http://localhost:3000/mypage");
            } else {
                loginEmailInput.current.value = "";
                loginPwInput.current.value = "";
                alert(response.data.message);
            }
        }).catch(function(error) {
            alert("서버 내부 오류입니다.\n 관리자에게 문의하세요.");
        });
    };

    return (
        <div>
            <div className="right_container">
                <div className="email">이메일</div>
                <div className="emailbox1"></div>
                <div className="emailbox2"></div>
                <div className="emailbar1"></div>
                <div className="emailbar2"></div>
                <div className="email_input ">
                    <input
                        type="email"
                        ref={loginEmailInput}
                        // onChange={onChangeInput}
                    />
                </div>
                <div className="password">비밀번호</div>
                <div className="passbox1"></div>
                <div className="passbox2"></div>
                <div className="passbar1"></div>
                <div className="passbar2"></div>
                <div className="password_input">
                    <input type="password" ref={loginPwInput} onChange={onChangePwd} />
                </div>
                <div className="loginbox1"></div>
                <div className="loginbox2"></div>
                <div className="loginbar1"></div>
                <div className="loginbar2"></div>
                <button className="login_btn" onClick={setLogin}>
                    로그인하기
                </button>
                <p className="search_email">이메일찾기 |</p>
                <p className="search_password">비밀번호찾기 |</p>
                <button className="register_btn">
                    <Link to="/register" className="Account">
                        가입하기
                    </Link>
                </button>
            </div>
        </div>
    );
}
