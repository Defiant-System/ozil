<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template name="controls-volume-menu">
		<div class="ctrl-menu volume">
			<div class="menu-wrapper">
				<div class="range" data-range="volume">
					<xsl:attribute name="data-change"><xsl:value-of select="//Menu[@for='volume']/Menu[@type='slider']/@change"/></xsl:attribute>
					<xsl:attribute name="style">--volume: <xsl:value-of select="//Menu[@for='volume']/Menu[@type='slider']/@value"/>%;</xsl:attribute>
					<span class="track"></span>
					<span class="knob"></span>
				</div>
				<span data-click="toggle-mute">
					<i class="icon-volume-mute"></i>
				</span>
			</div>
		</div>
	</xsl:template>


	<xsl:template name="controls-settings-menu">
		<div>
			<xsl:attribute name="class">ctrl-menu <xsl:value-of select="@for"/></xsl:attribute>
			<div>
				<div class="menu-wrapper">
					<xsl:for-each select="./*">
						<xsl:call-template name="controls-menu-item" />
					</xsl:for-each>
				</div>
			</div>
		</div>
	</xsl:template>


	<xsl:template name="controls-sub-menu">
		<div class="menu-wrapper">
			<xsl:attribute name="data-for"><xsl:value-of select="@for"/></xsl:attribute>
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
					<i><xsl:attribute name="class">
						<xsl:choose>
							<xsl:when test="@is-checked='1'">icon-radio-checked</xsl:when>
							<xsl:when test="@check-group">icon-radio</xsl:when>
							<xsl:otherwise><xsl:value-of select="@icon"/></xsl:otherwise>
						</xsl:choose>
					</xsl:attribute></i>
					<span class="name"><xsl:value-of select="@name"/></span>
				</span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<xsl:template name="media-file">
		<video crossorigin="anonymous" playsinline="inline" preload="none">
			<xsl:for-each select="./Meta[@id = 'source']">
				<source>
					<xsl:attribute name="src"><xsl:value-of select="@value"/></xsl:attribute>
					<xsl:attribute name="type"><xsl:value-of select="@type"/></xsl:attribute>
					<xsl:if test="@size">
						<xsl:attribute name="size"><xsl:value-of select="@size"/></xsl:attribute>
					</xsl:if>
		        </source>
			</xsl:for-each>
			<xsl:for-each select="./Meta[@id = 'track']">
				<track>
					<xsl:attribute name="src"><xsl:value-of select="@value"/></xsl:attribute>
					<xsl:attribute name="kind"><xsl:value-of select="@kind"/></xsl:attribute>
					<xsl:attribute name="label"><xsl:value-of select="@label"/></xsl:attribute>
					<xsl:attribute name="srclang"><xsl:value-of select="@lang"/></xsl:attribute>
		        </track>
			</xsl:for-each>
		</video>
	</xsl:template>

</xsl:stylesheet>