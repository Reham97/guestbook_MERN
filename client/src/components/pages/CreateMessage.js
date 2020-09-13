import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import materialize from 'materialize-css'
// import {IMGURI} from '../../keys'

const CreateMessage = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")


    useEffect(() => {
        if (url) {
            fetch("/createmessage", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url
                })
            }).then(res => res.json())
                .then(data => {

                    if (data.error) {
                        materialize.toast({ html: data.error, classes: "#c62828 red darken-3" })
                    }
                    else {
                        materialize.toast({ html: "Created Successfully", classes: "#43a047 green darken-1" })
                        // history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const messageDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "guestBook-mern")
        data.append("cloud_name", "software1997")
        fetch(process.env.IMGURI, {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })


    }


    return (
        <div className="card input-filed"
            style={{
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />
            <input
                type="text"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Uplaod Image</span>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => messageDetails()}
            >
                Submit Message
           </button>

        </div>

    )
}
export default CreateMessage