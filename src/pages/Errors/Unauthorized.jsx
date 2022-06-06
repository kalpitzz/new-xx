import styles from './Unauthorized.module.css'

const Unauthorized = () => {


    return (
        <div className={styles.body}>
            <div className={styles.error_main} >
                <h1>Oops!</h1>
                <div className={styles.error_heading}>Access Denied</div>
                <p>You do not have permission to access the module that you requested.</p>
            </div >
        </div>
    )
}

export default Unauthorized