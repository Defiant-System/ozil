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
		<div>
			<xsl:attribute name="class">ctrl-menu <xsl:value-of select="@for"/></xsl:attribute>
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
				<span class="name"><xsl:value-of select="@name"/></span>
			</span>
			<hr />
			<xsl:for-each select="./*">
				<xsl:call-template name="controls-menu-item" />
			</xsl:for-each>
		</div>
	</xsl:template>


	<xsl:template name="controls-menu-item">
		<xsl:choose>
			<xsl:when test="@type='hidden'"></xsl:when>
			<xsl:when test="@type='divider'">
				<hr/>
			</xsl:when>
			<xsl:otherwise>
				<span>
					<xsl:if test="count(./*) &gt; 0">
						<xsl:attribute name="data-click">menu-go-sub</xsl:attribute>
						<xsl:attribute name="data-arg"><xsl:value-of select="@name"/></xsl:attribute>
					</xsl:if>
					<xsl:if test="count(./*) = 0">
						<xsl:attribute name="data-click"><xsl:value-of select="@click"/></xsl:attribute>
					</xsl:if>
					<i><xsl:attribute name="class"><xsl:value-of select="@icon"/></xsl:attribute></i>
					<span class="name"><xsl:value-of select="@name"/></span>
				</span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>