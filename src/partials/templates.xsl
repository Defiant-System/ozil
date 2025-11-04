<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template name="controls-volume-menu">
		<div class="ctrl-menu volume">
			<div class="menu-wrapper">
				<div class="track" style="--val: 73%;">
					<span class="nob"></span>
				</div>
				<span data-click="volume-mute">
					<i class="icon-volume-mute"></i>
				</span>
			</div>
		</div>
	</xsl:template>


	<xsl:template name="controls-settings-menu">
		<div class="ctrl-menu settings">
			<div class="menu-wrapper">
				<xsl:for-each select="./*">
					<xsl:call-template name="controls-menu-item" />
				</xsl:for-each>
			</div>
		</div>
	</xsl:template>


	<xsl:template name="controls-sub-menu">
		<div class="menu-wrapper" data-for="captions">
			<span data-click="menu-go-back">
				<i class="icon-back"></i>
				<span class="name">Speed</span>
			</span>
			<hr />
			<span data-click="set-language" data-arg="none">
				<i class="icon-radio"></i>
				<span class="name">Disabled</span>
			</span>
			<span data-click="set-language" data-arg="en">
				<i class="icon-radio"></i>
				<span class="name">English</span>
			</span>
			<span data-click="set-language" data-arg="se">
				<i class="icon-radio-checked"></i>
				<span class="name">Svenska</span>
			</span>
			<span data-click="set-language" data-arg="fr">
				<i class="icon-radio"></i>
				<span class="name">French</span>
			</span>
		</div>
	</xsl:template>


	<xsl:template name="controls-menu-item">
		<xsl:choose>
			<xsl:when test="@type='hidden'"></xsl:when>
			<xsl:when test="@type='divider'">
				<hr/>
			</xsl:when>
			<xsl:otherwise>
				<span data-click="menu-go-sub" data-arg="captions">
					<i><xsl:attribute name="class"><xsl:value-of select="@icon"/></xsl:attribute></i>
					<span class="name"><xsl:value-of select="@name"/></span>
				</span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>