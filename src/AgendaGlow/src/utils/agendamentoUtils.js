export const isPast = (dateStr, timeStr) => {
  if (!dateStr) return false;
  
  // Converter "DD/MM/YYYY" para Date
  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  const schedDate = new Date(year, month, day);

  // Adicionar Hora "HH:mm" se existir
  if (timeStr) {
    const timeParts = timeStr.split(':');
    if (timeParts.length === 2) {
      schedDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
    }
  } else {
    // Se não tiver hora, assume-se o final do dia (23:59) para não concluir prematuramente
    schedDate.setHours(23, 59, 59);
  }

  const now = new Date();
  return schedDate < now;
};

/**
 * Retorna o status calculado.
 * Se for passado e não cancelado, retorna 'Concluido'.
 */
export const getComputedStatus = (agendamento) => {
  if (agendamento.status === 'Cancelado') return 'Cancelado';
  
  // Se já está marcado ou se a data já passou
  if (agendamento.status === 'Concluido' || isPast(agendamento.data, agendamento.horario)) {
    return 'Concluido';
  }
  
  return 'Pendente';
};