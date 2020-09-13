import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import materialize from 'materialize-css'
// import { IMGURI } from '../../keys'
import { useParams } from 'react-router-dom'

const UpdateMessage = () => {
    const { messageId } = useParams()
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [imageSrc, setImageSrc] = useState("")
    const [url, setUrl] = useState("")


    useEffect(() => {
        fetch(`/specificmessage/${messageId}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setTitle(result.message.title)
                setBody(result.message.body)
                setImageSrc(result.message.photo)
            }).catch(err => {
                console.log(err)
            })

    }, [])

    useEffect(() => {
        if (url) {
        updateImage()
        }
    }, [url])

    const setMessageImage = () => {
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

    const updateTitle = () => {
        fetch('/updatemessagetitle', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
            },
            body: JSON.stringify({
                title,
                messageId
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.error) {
                materialize.toast({ html: res.error, classes: "#c62828 red darken-3" })
            }
            else {
                materialize.toast({ html: "updated successfully", classes: "#43a047 green darken-1" })
                history.push('/')
            }
        }
        )
            .catch(err => {
                console.log(err)
            })
    }
    const updateBody = () => {
        fetch('/updatemessagebody', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
            },
            body: JSON.stringify({
                body,
                messageId
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.error) {
                materialize.toast({ html: res.error, classes: "#c62828 red darken-3" })
            }
            else {
                materialize.toast({ html: "updated successfully", classes: "#43a047 green darken-1" })
                history.push('/')
            }
        }
        )
            .catch(err => {
                console.log(err)
            })
    }
    const updateImage = () => {
        fetch('/updatemessagephoto', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
            },
            body: JSON.stringify({
                photo:url,
                messageId
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.error) {
                materialize.toast({ html: res.error, classes: "#c62828 red darken-3" })
            }
            else {
                materialize.toast({ html: "updated successfully", classes: "#43a047 green darken-1" })
                history.push('/')
            }
        }
        )
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
            <div>
                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                    src={imageSrc ? imageSrc : "loading"}
                />

            </div>
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => updateTitle()}
            >
                Update Title
           </button>


            <input
                type="text"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => updateBody()}
            >
                Update Body
           </button>



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
                onClick={() => setMessageImage()}
            >
                Update Image
           </button>

        </div>

    )
}
export default UpdateMessage