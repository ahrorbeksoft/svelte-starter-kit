<script lang="ts">
  import { useQuery } from "$lib/db";
  import { usersQuery } from "./_components/query";

  const q = useQuery(usersQuery);
</script>

{q.data?.$users?.[0]?.email}
