import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { postAnimation, putAnimation } from '../utils/animationRequests';

const downloadObjectAsJson = (exportObj) => {
    var dataStr = "data:text/jsoncharset=utf-8," + encodeURIComponent(JSON.stringify(exportObj))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    const name = exportObj.animationName.replace(/ /g, '-')
    downloadAnchorNode.setAttribute("download", `${name}-animation.json`)
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

const ExportButton = ({ animation, animationId, history }) => (
    <div className="exportButtons">
        <button className="export-button" onClick={downloadObjectAsJson.bind(null, animation)}>Export</button>
        <button className="save-button" onClick={async () => {
            if (animationId) {
                const { data } = await putAnimation(animationId, animation)
                console.log(data)
            } else {
                const { data } = await postAnimation(animation)
                if (data._id) {
                    history.replace(`/editor/${data._id}`)
                }
            }
        }}
        >
            Save
        </button>
    </div>
)

const mapStateToProps = state => ({ animation: state })

export default connect(mapStateToProps)(withRouter(ExportButton))
