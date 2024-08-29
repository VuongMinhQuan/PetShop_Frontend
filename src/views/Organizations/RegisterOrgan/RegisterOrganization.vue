<template>
	<div>
		<RegisterOrganizationForm @organizationRegistered="handleOrganizationRegistered" />
		<div v-if="showSuccessMessage" class="success-message">
			<p>Organization registered successfully!</p>
		</div>
	</div>
</template>

<script>
import RegisterOrganizationForm from '../../../components/Organization/RegisterOrganization.vue';

export default {
	components: {
		RegisterOrganizationForm,

	},
	data() {
		return {
			showSuccessMessage: false,
		};
	},
	methods: {
		handleOrganizationRegistered() {
			this.showSuccessMessage = true;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./RegisterOrgan";
</style>