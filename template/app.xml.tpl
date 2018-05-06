<mvc:View controllerName="${controller}" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
	<App id="app">
		<pages>
			<Page title="{i18n>appTitle}">
				<content>
                    <Text text="Hallo ${viewName}" />
				</content>
			</Page>
		</pages>
    </App>
</mvc:View>