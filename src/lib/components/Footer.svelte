<footer>
	<form name="email">
		<label>
			<h3 class="title_h3">Subscribe Form</h3>
			<input type="email" name="email" placeholder="Email Adress" autocomplete="on" required />
		</label>
		<button class="black_btn">Submit</button>
	</form>
	<a href="mailto:office@sapphostudio.shop" class="mailto">office@sapphostudio.shop</a>
	<a
		href="https://www.instagram.com/sappho_studio/"
		class="insta_link"
		target="_blank"
		rel="noopener noreferrer">
		<img src="/icons/Instagram.svg" alt="instagram" />
	</a>
	<a href="/impressum" class="impressum">Impressum</a>
	<span class="copyright">©2025 Sappho Studio.</span>
</footer>

<style lang="sass">
@use '../../styles/base/_variables.sass' as *;

footer
    margin-top: 35px
    display: flex
    flex-direction: column
    align-items: center
    gap: 18px
    padding: 30px 0 4px 0
    form
        display: flex
        flex-direction: column
        width: 450px
        label
            display: flex
            flex-direction: column
            .title_h3
                text-align: center
            input
                font-family: inherit
                margin-top: 4px
                padding: 8px
                background-color: $beige
                color: $black
                border: 1px solid transparent
                border-bottom: 1px solid $black
                border-radius: 0
                font-size: 15px
                outline: none
                &:focus, &:hover
                    border: 1px solid $black
                &::placeholder
                    color: $black
        .black_btn
            font-family: Arian, Arial, sans-serif
            margin-top: 7px
    .mailto
        margin-top: 102px
        text-decoration: none
        color: $black
        font-size: 15px
    .insta_link
        height: 0.9375rem
        width: 0.9375rem
    .impressum
        font-size: 15px
        text-decoration: none
        color: $black
    .copyright
        font-size: 15px
</style>
