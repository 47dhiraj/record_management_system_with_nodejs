import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

import { useUpdateRecordMutation, useDeleteRecordMutation } from "./recordsApiSlice"

import useAuth from "../../hooks/useAuth"


const EditRecordForm = ({ record, users }) => {         

    const { isManager, isAdmin } = useAuth()           

    const [updateRecord, {
        isLoading,
        isSuccess,
        isError,
        error

    }] = useUpdateRecordMutation()

    const [deleteRecord, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror

    }] = useDeleteRecordMutation()


    const navigate = useNavigate()

    const [title, setTitle] = useState(record.title)
    const [text, setText] = useState(record.text)
    const [completed, setCompleted] = useState(record.completed)
    const [userId, setUserId] = useState(record.user)


    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')

            navigate('/dash/records')
        }

    }, [isSuccess, isDelSuccess, navigate])


    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading


    const onSaveRecordClicked = async (e) => {
        if (canSave) {

            await updateRecord({ id: record.id, user: userId, title, text, completed })

        }
    }


    const onDeleteRecordClicked = async () => {

        await deleteRecord({ id: record.id })

    }

    const created = new Date(record.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(record.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })


    const options = users.map(user => {

        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )

    })


    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    let deleteButton = null
    if (isManager || isAdmin)                     
    {
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteRecordClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>

                <div className="form__title-row">

                    <h2 style={{ paddingLeft: "30%" }}> Edit Record #{record.ticket}</h2>

                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveRecordClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>

                        {deleteButton}

                    </div>

                </div>

                <label className="form__label" htmlFor="record-title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="record-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="record-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="record-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="record-completed">
                            TASK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="record-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="record-username">
                            ASSIGNED TO:</label>
                        <select
                            id="record-username"
                            name="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>

                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>

                </div>

            </form>
        </>
    )

    return content

}

export default EditRecordForm