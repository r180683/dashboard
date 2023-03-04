// Write your code here
// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const dashBoardStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {dashboardData: {}, dashBoardStatus: dashBoardStatusList.initial}

  componentDidMount() {
    this.getDashboardData()
  }

  getDashboardData = async () => {
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(each => ({
          age: each.age,
          count: each.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(each => ({
          count: each.count,
          gender: each.gender,
        })),
      }
      this.setState({
        dashboardData: updatedData,
        dashBoardStatus: dashBoardStatusList.success,
      })
    } else {
      this.setState({dashBoardStatus: dashBoardStatusList.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderSuccessView = () => {
    const {dashboardData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = dashboardData
    return (
      <ul className="dbs-container">
        <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </ul>
    )
  }

  renderDashboardData = () => {
    const {dashBoardStatus} = this.state
    switch (dashBoardStatus) {
      case dashBoardStatusList.initial:
        return this.renderLoadingView()
      case dashBoardStatusList.failure:
        return this.renderFailureView()
      case dashBoardStatusList.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="app-logo-container">
          <img
            className="app-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          />
          <h1 className="app-logo-name">Co-WIN</h1>
        </div>
        <h1 className="head">CoWIN Vaccination in India</h1>
        {this.renderDashboardData()}
      </div>
    )
  }
}

export default CowinDashboard
