import React from 'react'
import { Link } from 'react-router-dom'
import { deleteAnimation } from '../utils/animationRequests';

const AnimationListItem = ({ animation: { name, _id }, onDelete }) => (
    <div className="animationListItem">
        <Link to={`/editor/${_id}`}>
            <span className="animation-name animation-link">{name}</span>
        </Link>
        <button
            onClick={async () => {
                const { status } = await deleteAnimation(_id)
                if (status === 204) {
                    onDelete(_id)
                }
            }}
        >
            delete
        </button>
    </div>
)

export default AnimationListItem
