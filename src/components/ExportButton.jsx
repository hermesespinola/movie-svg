import React from 'react'
import { connect } from 'react-redux'

const downloadObjectAsJson = (exportObj) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    // TODO: change name with server
    downloadAnchorNode.setAttribute("download", `movieSVG-animation.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

const ExportButton = ({ animation }) => (
    <button className="export-button" onClick={downloadObjectAsJson.bind(null, animation)}>Export</button>
)

const mapStateToProps = state => ({ animation: state })

export default connect(mapStateToProps)(ExportButton)
