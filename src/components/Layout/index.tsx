import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../Header";
import MetaInfo from "../MetaInfo";
import LeftDrawer from "../LeftDrawer";
import LoginDialog from "../LoginDialog";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import GlobalLoading from "@/components/GlobalLoading";
import type { ICurrentPage, ISiteConfig } from "@/types/index";

const Root = styled("main")(({ theme }) => ({
	flexGrow: 1,
	padding: theme.spacing(2),
	paddingTop: "75px",
	minHeight: "100vh",
	position: "relative",
	maxWidth: "1400px",
	margin: "0 auto",
}));

/**
 * 全局snackbar
 */
const GlobalSnackbar = () => {
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarConfig, setSnackbarConfig] = useState({
		message: "无消息",
	});
	useEffect(() => {
		window.snackbar = (config) => {
			setSnackbarConfig(config);
			setOpenSnackbar(true);
		};
	});
	const handleSnackbarClose = () => {
		setOpenSnackbar(false);
	};
	return (
		<Snackbar
			{...snackbarConfig}
			open={openSnackbar}
			onClose={handleSnackbarClose}
		/>
	);
};

class Layout extends React.Component<
	{
		siteConfig: ISiteConfig;
		currentPage: ICurrentPage;
		locale?: string;
		children: JSX.Element | JSX.Element[];
		menuItems: any[];
	},
	{
		LeftDrawerOpen: boolean;
		anchorEl: null | HTMLElement;
		loading: boolean;
		title: string;
		PageAction: () => JSX.Element;
	}
> {
	loading: any;
	constructor(props: any) {
		super(props);
		this.state = {
			LeftDrawerOpen: false,
			anchorEl: null,
			loading: true,
			title: "首页",
			PageAction: null,
		};
	}
	setAction = (Comp) => {
		this.setState({
			PageAction: Comp,
		});
	};
	componentDidMount() {
		window.loadShow = () => {
			window.loadingDelay = setTimeout(() => {
				this.setState({
					loading: true,
				});
				// toggleDisabled(true);
				delete window.loadingDelay;
			}, 700);
		};
		window.loadHide = () => {
			if (window.loadingDelay) {
				clearTimeout(window.loadingDelay);
				delete window.loadingDelay;
			} else {
				this.setState({
					loading: false,
				});
				// toggleDisabled(false);?
			}
		};
	}
	render() {
		const { PageAction } = this.state;
		const { currentPage, siteConfig, locale, children, menuItems } =
			this.props;
		const { author, title } = siteConfig;
		const activeTitle = `${currentPage ? `${currentPage.title} - ` : ""}${
			title[locale]
		}`;

		const activeDescription =
			currentPage.description || siteConfig.description;

		const childrenWithProps = React.Children.map(children, (child) => {
			// checking isValidElement is the safe way and avoids a typescript error too
			const props = { setAction: this.setAction };
			if (React.isValidElement(child)) {
				return React.cloneElement(child, props);
			}
			return child;
		});

		return (
			<>
				<Head>
					<MetaInfo
						authorName={author.name}
						description={activeDescription}
						root={siteConfig.root}
						title={activeTitle}
						keywords={siteConfig.keywords}
					/>
				</Head>
				<Box sx={{ display: "flex" }}>
					<CssBaseline />
					<LoginDialog />
					<Header PageAction={PageAction} title={currentPage.title} />
					<LeftDrawer repo={siteConfig.repo} />
					<Root>{childrenWithProps}</Root>
				</Box>
				<GlobalSnackbar />
				<GlobalLoading />
			</>
		);
	}
}

export default Layout;
