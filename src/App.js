import React, { useEffect, useState } from 'react'
import logo from './logo.svg';
import './App.css';
// 👇 Вход реализован с помощью react-yandex-login
import { YandexLogin, YandexLogout } from 'react-yandex-login';

// 👇 ID приложения
const clientID = '0b5621ec87da4d8b8fd6b908caa97fb4';

function App() {
  const [userData, setUserData] = useState(undefined);
  const [fileList, setFileList] = useState(null);

// 👇 Обработка логин/логаут
  const loginSuccess = (userData) => {
    console.log('User Data: ', userData);
    setUserData(userData)
  }

  const logoutSuccess = () => {
    setUserData(null);
  }

// 👇 Обработка выбора/загруки файлов
  const handleFileChange = (e) => {
    setFileList(e.target.files);
  };

  const handleUploadClick = () => {
    if (!fileList || fileList.length > 100) {
      return alert('Файлы не выбраны, или их количество > 100');
    }
    
    for (let i = 0; i < fileList.length; i++) {
      fetch('https://cloud-api.yandex.net/v1/disk/resources/upload?path=' +fileList[i].name, {
        method: 'GET',
        headers: {
          'Authorization': 'OAuth ' + userData.access_token,
        }
      }).then(function(response) {  
            response.json()
                    .then((value) => {
                      fetch(value.href, {
                      method: 'PUT',
                      body: fileList[i]
                      });
            }).then((response) => console.log(response));
          });
    }
  };

  const files = fileList ? [...fileList] : [];

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>file-uploader</h1>
      </header>
      <div className='file-uploader'>
        <div className='login-out-section'>
          {!userData && 
            <YandexLogin clientID={clientID} onSuccess={loginSuccess}>
              <button>Yandex Login</button>
            </YandexLogin>
          }
          {userData &&
            <div className='logout-section'>
              <YandexLogout onSuccess={logoutSuccess}>
                <button>Yandex Logout</button>
              </YandexLogout>
              <ul>
                <li>access_token: {userData.access_token}</li>
                <li>expires_in: {userData.expires_in}</li>
                <li>token_type: {userData.token_type}</li>
              </ul>
            </div>
          }
        </div>
        <div className='file-upload-section'>
          <div className='upload-controls'>
            <input type="file" onChange={handleFileChange} multiple />
            <button onClick={handleUploadClick}>Upload</button>     
          </div>     
          <ul>
            {files.map((file, i) => (
              <li key={i}>
                {file.name} - {file.type}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
