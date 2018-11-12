import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { getAnimationList } from '../utils/animationRequests'
import AnimationListItem from '../components/AnimationListItem'

class Dashboard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = { animationList: null, loading: true, isMounted: false }
    }

    componentDidMount() {
        this.setState({ loading: true, isMounted: true })
    }

    async componentDidUpdate() {
        if (!this.state.animationList) {
            const { data: animationList } = await getAnimationList()
            if (this.state.isMounted) {
                this.setState({ animationList, loading: false })
            }
        }
    }

    onDelete = (animationId) => {
        console.log('onDelete:', animationId)
        const animationList = this.state.animationList.filter(anim => anim._id !== animationId)
        this.setState({ animationList })
    }

    render() {
        const { animationList, loading } = this.state
        return loading ? <div className="loading">Loading...</div> : (
            <div className="dashboard">
                <div className="animationList">
                    {animationList.map(animation => (
                        <AnimationListItem key={animation._id} animation={animation} onDelete={this.onDelete} />
                    ))}
                </div>
                <div className="newAnimation">
                    <Link to="/editor">
                        <button className="newAnimation">
                            New Animation
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Dashboard
