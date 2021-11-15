import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT } from '../store/types/UserTypes';
import Logo from '../images/Blogifyfav.png'
const Navbar = () => {
	const { user } = useSelector((state) => state.AuthReducer);
	const dispatch = useDispatch();
	const logout = () => {
		localStorage.removeItem('myToken');
		dispatch({ type: LOGOUT });
	};
	const Links = user ? (
		<div className='navbar__right'>
			{user.role!==0 ? (
				<>
					<li>
						<Link to='/users'>All Users</Link>
					</li>
					<li>
					<Link to='/posts'>All Posts</Link>
					</li>
				</>
			): ""} 
			<li>
				<Link to='/create'>Create Post</Link>
			</li>
			<li>
				<Link to='/dashboard/1'>{user.name}</Link>
			</li>
			<li>
				<span onClick={logout}>Logout</span>
			</li>
		</div>
	) : (
		<div className='navbar__right'>
			<li>
				<Link to='/login'>Login</Link>
			</li>
			<li>
				<Link to='/register'>Register</Link>
			</li>
		</div>
	);
	return (
		<nav className='navbar'>
			<div className='container'>
				<div className='navbar__row'>
					<div className='navbar__left'>
						<Link to='/'>
							<img src={Logo} alt='' style={{width:"100px"}}/>
						</Link>
					</div>
					{Links}
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
